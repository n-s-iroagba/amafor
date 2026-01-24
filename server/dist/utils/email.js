"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUnsubscribeToken = exports.generateUnsubscribeLink = exports.checkEmailHealth = exports.sendDailySummaryEmail = exports.sendRatesChangeNotification = exports.sendBatchJobCompletionEmail = exports.sendSystemNotificationEmail = exports.sendPatronWelcomeEmail = exports.sendScoutApprovalEmail = exports.sendCampaignApprovalEmail = exports.sendDonationReceipt = exports.sendWelcomeEmail = exports.sendPasswordResetEmail = exports.sendVerificationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const tracer_1 = require("./tracer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@amaforgladiatorsfc.com';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Amafor Gladiators FC';
// Create transporter
const transporter = nodemailer_1.default.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
// Verify transporter connection
transporter.verify((error) => {
    if (error) {
        logger_1.logger.error('Email transporter verification failed', { error });
    }
    else {
        logger_1.logger.info('Email transporter is ready to send messages');
    }
});
// Load email templates
const templates = {};
const loadTemplates = () => {
    const templatesDir = path_1.default.join(__dirname, '../templates/email');
    if (!fs_1.default.existsSync(templatesDir)) {
        logger_1.logger.warn('Email templates directory not found', { path: templatesDir });
        return;
    }
    const templateFiles = fs_1.default.readdirSync(templatesDir);
    templateFiles.forEach(file => {
        if (file.endsWith('.hbs')) {
            const templatePath = path_1.default.join(templatesDir, file);
            const templateContent = fs_1.default.readFileSync(templatePath, 'utf8');
            const templateName = path_1.default.basename(file, '.hbs');
            templates[templateName] = handlebars_1.default.compile(templateContent);
            logger_1.logger.debug('Loaded email template', { template: templateName });
        }
    });
};
// Load templates on startup
loadTemplates();
// Send email
const sendEmail = async (options) => {
    return tracer_1.tracer.startActiveSpan('email.send', async (span) => {
        try {
            span.setAttributes({
                'email.to': Array.isArray(options.to) ? options.to.join(',') : options.to,
                'email.subject': options.subject,
                'email.template': options.template || 'custom',
            });
            let html = options.html;
            let text = options.text;
            // Use template if specified
            if (options.template && templates[options.template]) {
                const templateData = {
                    ...options.data,
                    year: new Date().getFullYear(),
                    siteUrl: process.env.FRONTEND_URL || 'https://amaforgladiatorsfc.com',
                    supportEmail: 'support@amaforgladiatorsfc.com',
                };
                html = templates[options.template](templateData);
                text = html.replace(/<[^>]*>/g, ' '); // Basic HTML to text conversion
            }
            const mailOptions = {
                from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
                to: options.to,
                subject: options.subject,
                html,
                text,
                cc: options.cc,
                bcc: options.bcc,
                replyTo: options.replyTo,
                attachments: options.attachments,
                headers: {
                    'X-Priority': '3',
                    'X-Mailer': 'Amafor Gladiators FC Email Service',
                },
            };
            const info = await transporter.sendMail(mailOptions);
            span.setAttributes({
                'email.success': true,
                'email.message_id': info.messageId,
                'email.accepted': info.accepted?.length || 0,
                'email.rejected': info.rejected?.length || 0,
            });
            logger_1.logger.info('Email sent successfully', {
                to: options.to,
                subject: options.subject,
                messageId: info.messageId,
            });
            return {
                success: true,
                messageId: info.messageId,
                accepted: info.accepted,
                rejected: info.rejected,
            };
        }
        catch (error) {
            const err = error;
            span.setStatus({
                code: 2,
                message: err.message,
            });
            logger_1.logger.error('Error sending email', {
                error: err.message,
                to: options.to,
                subject: options.subject,
            });
            return {
                success: false,
                error: err.message,
            };
        }
        finally {
            span.end();
        }
    });
};
exports.sendEmail = sendEmail;
// Send verification email
const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    return (0, exports.sendEmail)({
        to: email,
        subject: 'Verify Your Email - Amafor Gladiators FC',
        template: 'verification',
        data: {
            name,
            verificationUrl,
            expiryHours: 24,
        },
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
// Send password reset email
const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    return (0, exports.sendEmail)({
        to: email,
        subject: 'Reset Your Password - Amafor Gladiators FC',
        template: 'password-reset',
        data: {
            name,
            resetUrl,
            expiryHours: 1,
        },
    });
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
// Send welcome email
const sendWelcomeEmail = async (email, name, userType) => {
    return (0, exports.sendEmail)({
        to: email,
        subject: 'Welcome to Amafor Gladiators FC!',
        template: 'welcome',
        data: {
            name,
            userType,
            dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
            supportEmail: 'support@amaforgladiatorsfc.com',
        },
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
// Send donation receipt
const sendDonationReceipt = async (email, name, amount, currency, reference, date) => {
    return (0, exports.sendEmail)({
        to: email,
        subject: 'Donation Receipt - Amafor Gladiators FC',
        template: 'donation-receipt',
        data: {
            name,
            amount: amount.toLocaleString(),
            currency,
            reference,
            date: date.toLocaleDateString(),
            receiptUrl: `${process.env.FRONTEND_URL}/donations/receipt/${reference}`,
        },
    });
};
exports.sendDonationReceipt = sendDonationReceipt;
// Send campaign approval email
const sendCampaignApprovalEmail = async (email, campaignName, advertiserName) => {
    return (0, exports.sendEmail)({
        to: email,
        subject: 'Your Ad Campaign Has Been Approved!',
        template: 'campaign-approved',
        data: {
            advertiserName,
            campaignName,
            dashboardUrl: `${process.env.FRONTEND_URL}/advertiser/dashboard`,
        },
    });
};
exports.sendCampaignApprovalEmail = sendCampaignApprovalEmail;
// Send scout application approved email
const sendScoutApprovalEmail = async (email, scoutName) => {
    return (0, exports.sendEmail)({
        to: email,
        subject: 'Scout Application Approved - Amafor Gladiators FC',
        template: 'scout-approved',
        data: {
            scoutName,
            portalUrl: `${process.env.FRONTEND_URL}/pro-view`,
            supportEmail: 'support@amaforgladiatorsfc.com',
        },
    });
};
exports.sendScoutApprovalEmail = sendScoutApprovalEmail;
// Send patron welcome email
const sendPatronWelcomeEmail = async (email, name, tier, amount, frequency) => {
    return (0, exports.sendEmail)({
        to: email,
        subject: 'Welcome to the Patron Community!',
        template: 'patron-welcome',
        data: {
            name,
            tier,
            amount: amount.toLocaleString(),
            frequency,
            patronPageUrl: `${process.env.FRONTEND_URL}/patrons`,
            accountUrl: `${process.env.FRONTEND_URL}/account/subscriptions`,
        },
    });
};
exports.sendPatronWelcomeEmail = sendPatronWelcomeEmail;
// Send system notification email
const sendSystemNotificationEmail = async (email, subject, message, actionUrl) => {
    return (0, exports.sendEmail)({
        to: email,
        subject: subject,
        template: 'system-notification',
        data: {
            message,
            actionUrl,
            siteUrl: process.env.FRONTEND_URL || 'https://amaforgladiatorsfc.com',
        },
    });
};
exports.sendSystemNotificationEmail = sendSystemNotificationEmail;
// Send batch job completion email
const sendBatchJobCompletionEmail = async (email, jobType, successCount, failureCount, totalCount, downloadUrl) => {
    return (0, exports.sendEmail)({
        to: email,
        subject: `Batch ${jobType} Completed`,
        template: 'batch-job-complete',
        data: {
            jobType,
            successCount,
            failureCount,
            totalCount,
            downloadUrl,
            completionTime: new Date().toLocaleString(),
        },
    });
};
exports.sendBatchJobCompletionEmail = sendBatchJobCompletionEmail;
// Send advertising rates change notification
const sendRatesChangeNotification = async (advertiserEmails, effectiveDate, changes) => {
    const promises = advertiserEmails.map(email => (0, exports.sendEmail)({
        to: email,
        subject: 'Upcoming Changes to Advertising Rates',
        template: 'rates-change',
        data: {
            effectiveDate: effectiveDate.toLocaleDateString(),
            noticeDays: Math.ceil((effectiveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            changes,
            contactEmail: 'advertising@amaforgladiatorsfc.com',
        },
    }));
    return Promise.all(promises);
};
exports.sendRatesChangeNotification = sendRatesChangeNotification;
// Send daily summary email (for admins)
const sendDailySummaryEmail = async (adminEmails, summary) => {
    const promises = adminEmails.map(email => (0, exports.sendEmail)({
        to: email,
        subject: `Daily Summary - ${summary.date}`,
        template: 'daily-summary',
        data: summary,
    }));
    return Promise.all(promises);
};
exports.sendDailySummaryEmail = sendDailySummaryEmail;
// Check email service health
const checkEmailHealth = async () => {
    return tracer_1.tracer.startActiveSpan('email.checkHealth', async (span) => {
        try {
            const startTime = Date.now();
            await transporter.verify();
            const latency = Date.now() - startTime;
            span.setAttributes({
                'email.healthy': true,
                'email.latency_ms': latency,
            });
            return {
                healthy: true,
                latency,
            };
        }
        catch (error) {
            const err = error;
            span.setAttributes({
                'email.healthy': false,
                'email.error': err.message,
            });
            return {
                healthy: false,
                error: err.message,
            };
        }
        finally {
            span.end();
        }
    });
};
exports.checkEmailHealth = checkEmailHealth;
// Generate unsubscribe link
const generateUnsubscribeLink = (email, subscriptionType) => {
    const token = Buffer.from(`${email}:${subscriptionType}:${Date.now()}`).toString('base64');
    return `${process.env.FRONTEND_URL}/unsubscribe?token=${encodeURIComponent(token)}`;
};
exports.generateUnsubscribeLink = generateUnsubscribeLink;
// Validate unsubscribe token
const validateUnsubscribeToken = (token) => {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const [email, subscriptionType, timestamp] = decoded.split(':');
        if (!email || !subscriptionType || !timestamp) {
            return null;
        }
        const tokenDate = new Date(parseInt(timestamp));
        const now = new Date();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        if (now.getTime() - tokenDate.getTime() > maxAge) {
            return null; // Token expired
        }
        return {
            email,
            subscriptionType,
            timestamp: parseInt(timestamp),
        };
    }
    catch (error) {
        logger_1.logger.error('Error validating unsubscribe token', { error });
        return null;
    }
};
exports.validateUnsubscribeToken = validateUnsubscribeToken;
// Export all email utilities
exports.default = {
    sendEmail: exports.sendEmail,
    sendVerificationEmail: exports.sendVerificationEmail,
    sendPasswordResetEmail: exports.sendPasswordResetEmail,
    sendWelcomeEmail: exports.sendWelcomeEmail,
    sendDonationReceipt: exports.sendDonationReceipt,
    sendCampaignApprovalEmail: exports.sendCampaignApprovalEmail,
    sendScoutApprovalEmail: exports.sendScoutApprovalEmail,
    sendPatronWelcomeEmail: exports.sendPatronWelcomeEmail,
    sendSystemNotificationEmail: exports.sendSystemNotificationEmail,
    sendBatchJobCompletionEmail: exports.sendBatchJobCompletionEmail,
    sendRatesChangeNotification: exports.sendRatesChangeNotification,
    sendDailySummaryEmail: exports.sendDailySummaryEmail,
    checkEmailHealth: exports.checkEmailHealth,
    generateUnsubscribeLink: exports.generateUnsubscribeLink,
    validateUnsubscribeToken: exports.validateUnsubscribeToken,
    EMAIL_FROM,
    EMAIL_FROM_NAME,
};
//# sourceMappingURL=email.js.map