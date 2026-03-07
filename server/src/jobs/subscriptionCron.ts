import cron from 'node-cron';
import { Op } from 'sequelize';
import { PatronSubscription, SubscriptionStatus } from '../models/PatronSubscription';
import EmailService from '../services/EmailService';
import User from '../models/User';
import logger from '../utils/logger';

// Run every day at 12:00 PM
export const startSubscriptionCron = () => {
    cron.schedule('0 12 * * *', async () => {
        logger.info('Running daily subscription renewal check...');
        try {
            const now = new Date();
            // Find active subscriptions whose nextBillingDate is today or earlier
            const dueSubscriptions = await PatronSubscription.findAll({
                where: {
                    status: SubscriptionStatus.ACTIVE,
                    nextBillingDate: {
                        [Op.lte]: now,
                    },
                },
            });

            for (const subscription of dueSubscriptions) {
                try {
                    const sevenDaysAgo = new Date(now);
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                    const metadata = subscription.metadata || {};
                    const lastReminderStr = metadata.lastReminderSentAt;

                    if (lastReminderStr) {
                        const lastReminderDate = new Date(lastReminderStr);
                        // Don't spam: only send email if we haven't sent one in the last 7 days
                        if (lastReminderDate > sevenDaysAgo) {
                            continue;
                        }
                    }

                    const patron = await User.findByPk(subscription.patronId);
                    if (!patron) continue;

                    // Generate check out URL matching the query parameters parsed on the frontend
                    // <FRONTEND_URL>/patron/checkout?email=X&name=Y&tier=Z&frequency=F&amount=A&subscriptionId=S&type=subscription
                    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://www.amaforgaladiatorsfc.com' : 'http://localhost:3000';

                    const searchParams = new URLSearchParams({
                        type: 'subscription',
                        email: patron.email,
                        name: `${patron.firstName} ${patron.lastName}`.trim() || 'Patron',
                        tier: subscription.tier,
                        frequency: subscription.frequency,
                        amount: subscription.amount.toString(),
                        subscriptionId: subscription.id
                    });

                    const checkoutLink = `${baseUrl}/patron/checkout?${searchParams.toString()}`;

                    const emailService = EmailService.getInstance();
                    await emailService.sendSubscriptionRenewalEmail(
                        patron.email,
                        `${patron.firstName} ${patron.lastName}`.trim(),
                        subscription.tier,
                        subscription.amount,
                        checkoutLink
                    );

                    // Update metadata to track last reminder sent
                    metadata.lastReminderSentAt = now.toISOString();
                    subscription.changed('metadata', true); // Force metadata to update if it's a JSON field
                    await subscription.save();

                    logger.info(`Renewal email sent for subscription ${subscription.id} (Patron: ${patron.email})`);
                } catch (innerError: any) {
                    logger.error(`Error processing renewal for subscription ${subscription.id}`, { error: innerError.message });
                }
            }
        } catch (error: any) {
            logger.error('Error during daily subscription renewal check', { error: error.message });
        }
    });
};
