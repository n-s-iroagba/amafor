"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronageService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
class PatronageService {
    constructor() {
        this.patronRepo = new repositories_1.PatronSubscriptionRepository();
        this.userRepo = new repositories_1.UserRepository();
    }
    async subscribeUser(userId, tier, amount) {
        return utils_1.tracer.startActiveSpan('service.PatronageService.subscribeUser', async (span) => {
            try {
                // 1. Check if user exists
                const user = await this.userRepo.findById(userId);
                if (!user)
                    throw new Error('User not found');
                // 2. Deactivate any existing active subscriptions
                await this.patronRepo.deactivateCurrent(userId);
                // 3. Create new subscription
                const subscription = await this.patronRepo.create({
                    userId,
                    tier,
                    amount,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
                });
                // 4. Update User Role/Badges if necessary
                await this.userRepo.update(userId, { isPatron: true, patronTier: tier });
                utils_1.structuredLogger.business('PATRON_SUBSCRIBED', amount, userId, { tier });
                return subscription;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async checkSubscriptionStatus(userId) {
        return utils_1.tracer.startActiveSpan('service.PatronageService.checkSubscriptionStatus', async (span) => {
            try {
                const sub = await this.patronRepo.findActiveByUserId(userId);
                if (!sub)
                    return { isActive: false };
                // Logic to check if expired
                const now = new Date();
                if (sub.nextBillingDate < now) {
                    // In a real system, we would trigger a renewal check here or mark as 'PAST_DUE'
                    return { isActive: false, tier: sub.tier };
                }
                return { isActive: true, tier: sub.tier };
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.PatronageService = PatronageService;
//# sourceMappingURL=PatronageService.js.map