"use strict";
// services/PaymentService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const PaymentRepository_1 = require("@repositories/PaymentRepository");
const Payment_1 = require("@models/Payment");
const AdCampaign_1 = require("@models/AdCampaign");
const User_1 = require("@models/User");
const logger_1 = __importDefault(require("@utils/logger"));
const PaymentGatewayService_1 = require("./PaymentGatewayService");
class PaymentService {
    constructor(repository) {
        this.repository = repository || new PaymentRepository_1.PaymentRepository();
        this.paystackService = (0, PaymentGatewayService_1.getPaystackService)();
    }
    async createAdvertisementPayment(data) {
        try {
            // Validate ad campaign exists
            const adCampaign = await AdCampaign_1.AdCampaign.findByPk(data.adCampaignId);
            if (!adCampaign) {
                throw new AppError('Ad campaign not found', 404);
            }
            // Validate user exists
            const user = await User_1.User.findByPk(data.userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            // Create payment record
            const paymentData = {
                userId: data.userId,
                reference: this.generateReference(),
                amount: this.paystackService.convertToKobo(data.amount),
                currency: data.currency || Payment_1.Currency.NGN,
                status: Payment_1.PaymentStatus.PENDING,
                type: Payment_1.PaymentType.ADVERTISEMENT,
                provider: Payment_1.PaymentProvider.PAYSTACK,
                adCampaignId: data.adCampaignId,
                subscriptionId: null,
                providerReference: null,
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                ipAddress: data.ipAddress ?? null,
                userAgent: data.userAgent ?? null,
                metadata: {
                    ...data.metadata,
                    adCampaignName: adCampaign.name,
                },
            };
            const payment = await this.repository.create(paymentData);
            // Initialize payment with Paystack
            const paystackData = {
                email: data.customerEmail,
                amount: paymentData.amount,
                reference: payment.reference,
                currency: paymentData.currency,
                metadata: {
                    paymentId: payment.id,
                    userId: data.userId,
                    adCampaignId: data.adCampaignId,
                },
                callback_url: `${process.env.APP_URL}/payments/verify/${payment.reference}`,
            };
            const paystackResponse = await this.paystackService.initializePayment(paystackData);
            logger_1.default.info('Advertisement payment created', {
                paymentId: payment.id,
                reference: payment.reference,
                amount: data.amount,
            });
            return {
                payment: payment.toJSON(),
                paymentUrl: paystackResponse.data.authorization_url,
                reference: payment.reference,
            };
        }
        catch (error) {
            logger_1.default.error('Failed to create advertisement payment', {
                error: error.message,
                data,
            });
            throw error;
        }
    }
    async createDonationPayment(data) {
        try {
            // Validate user exists
            const user = await User_1.User.findByPk(data.userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            // Create payment record
            const paymentData = {
                userId: data.userId,
                reference: this.generateReference(),
                amount: this.paystackService.convertToKobo(data.amount),
                currency: data.currency || Payment_1.Currency.NGN,
                status: Payment_1.PaymentStatus.PENDING,
                type: Payment_1.PaymentType.DONATION,
                provider: Payment_1.PaymentProvider.PAYSTACK,
                adCampaignId: null,
                subscriptionId: data.subscriptionId ?? null,
                providerReference: null,
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                customerPhone: data.customerPhone ?? null,
                metadata: {
                    ...data.metadata,
                },
                ipAddress: data.ipAddress ?? null,
                userAgent: data.userAgent ?? null,
            };
            const payment = await this.repository.create(paymentData);
            // Initialize payment with Paystack
            const paystackData = {
                email: data.customerEmail,
                amount: paymentData.amount,
                reference: payment.reference,
                currency: paymentData.currency,
                metadata: {
                    paymentId: payment.id,
                    userId: data.userId,
                },
                callback_url: `${process.env.APP_URL}/payments/verify/${payment.reference}`,
            };
            const paystackResponse = await this.paystackService.initializePayment(paystackData);
            logger_1.default.info('Donation payment created', {
                paymentId: payment.id,
                reference: payment.reference,
                amount: data.amount,
            });
            return {
                payment: payment.toJSON(),
                paymentUrl: paystackResponse.data.authorization_url,
                reference: payment.reference,
            };
        }
        catch (error) {
            logger_1.default.error('Failed to create donation payment', {
                error: error.message,
                data,
            });
            throw error;
        }
    }
    async verifyPayment(reference) {
        try {
            // Find payment by reference
            let payment = await this.repository.findByReference(reference);
            if (!payment) {
                throw new AppError('Payment not found', 404);
            }
            // Skip if already verified
            if (payment.isSuccessful()) {
                return {
                    payment: payment.toJSON(),
                    isSuccessful: true,
                    message: 'Payment already verified',
                };
            }
            // Verify with Paystack
            const verification = await this.paystackService.verifyPayment(reference);
            // Update payment status
            const status = this.mapPaystackStatus(verification.data.status);
            const updatedPayment = await this.repository.markAsVerified(reference, verification.data.reference);
            if (!updatedPayment) {
                throw new AppError('Failed to update payment status', 500);
            }
            // Trigger post-payment actions based on payment type
            await this.handlePostPaymentActions(updatedPayment);
            logger_1.default.info('Payment verified successfully', {
                reference,
                status,
                amount: verification.data.amount,
            });
            return {
                payment: updatedPayment.toJSON(),
                isSuccessful: status === Payment_1.PaymentStatus.SUCCESSFUL,
                message: verification.data.gateway_response,
            };
        }
        catch (error) {
            logger_1.default.error('Failed to verify payment', {
                error: error.message,
                reference,
            });
            // Update payment status to failed
            await this.repository.updatePaymentStatus(reference, Payment_1.PaymentStatus.FAILED);
            throw error;
        }
    }
    async handleWebhook(payload, signature) {
        try {
            // Verify webhook signature
            const isValid = await this.paystackService.verifyWebhookSignature(payload, signature);
            if (!isValid) {
                throw new AppError('Invalid webhook signature', 401);
            }
            const event = payload.event;
            const data = payload.data;
            switch (event) {
                case 'charge.success':
                    await this.handleSuccessfulCharge(data);
                    break;
                case 'charge.failed':
                    await this.handleFailedCharge(data);
                    break;
                case 'transfer.success':
                    await this.handleSuccessfulTransfer(data);
                    break;
                case 'transfer.failed':
                    await this.handleFailedTransfer(data);
                    break;
                default:
                    logger_1.default.info(`Unhandled webhook event: ${event}`);
            }
            logger_1.default.info('Webhook processed successfully', { event });
        }
        catch (error) {
            logger_1.default.error('Failed to process webhook', {
                error: error.message,
                event: payload?.event,
            });
            throw error;
        }
    }
    async getPaymentById(id) {
        const payment = await this.repository.findById(id);
        if (!payment) {
            throw new AppError('Payment not found', 404);
        }
        return payment.toJSON();
    }
    async getUserPayments(userId, page = 1, limit = 20) {
        const payments = await this.repository.findByUserId(userId);
        const total = payments.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return {
            payments: payments.slice(startIndex, endIndex).map(p => p.toJSON()),
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
        };
    }
    async getPaymentStats(startDate, endDate) {
        return await this.repository.getPaymentStats(startDate, endDate);
    }
    async getRevenueStats() {
        const [totalRevenue, revenueByType, monthlyRevenue, topCustomers] = await Promise.all([
            this.repository.getTotalRevenue(),
            this.repository.getRevenueByType(),
            this.getMonthlyRevenue(),
            this.getTopCustomers(),
        ]);
        return {
            totalRevenue,
            revenueByType,
            monthlyRevenue,
            topCustomers,
        };
    }
    async refundPayment(id) {
        const payment = await this.repository.findById(id);
        if (!payment) {
            throw new AppError('Payment not found', 404);
        }
        if (!payment.isRefundable()) {
            throw new AppError('Payment is not refundable', 400);
        }
        // Implement refund logic with Paystack
        // This is a simplified version - in production, you'd need to handle refunds properly
        const refundedPayment = await this.repository.markAsRefunded(id);
        if (!refundedPayment) {
            throw new AppError('Failed to process refund', 500);
        }
        logger_1.default.info('Payment refunded', { paymentId: id, amount: payment.amount });
        return refundedPayment.toJSON();
    }
    // Private helper methods
    generateReference() {
        return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    mapPaystackStatus(paystackStatus) {
        const statusMap = {
            success: Payment_1.PaymentStatus.SUCCESSFUL,
            failed: Payment_1.PaymentStatus.FAILED,
            abandoned: Payment_1.PaymentStatus.FAILED,
            pending: Payment_1.PaymentStatus.PENDING,
        };
        return statusMap[paystackStatus] || Payment_1.PaymentStatus.FAILED;
    }
    async handlePostPaymentActions(payment) {
        try {
            if (payment.type === Payment_1.PaymentType.ADVERTISEMENT && payment.adCampaignId) {
                // Activate ad campaign
                const adCampaign = await AdCampaign_1.AdCampaign.findByPk(payment.adCampaignId);
                if (adCampaign) {
                    await adCampaign.update({ status: AdCampaign_1.CampaignStatus.ACTIVE });
                    logger_1.default.info('Ad campaign activated', { adCampaignId: payment.adCampaignId });
                }
            }
            else if (payment.type === Payment_1.PaymentType.DONATION) {
                // Log donation payment completion
                logger_1.default.info('Donation payment completed', { paymentId: payment.id });
            }
        }
        catch (error) {
            logger_1.default.error('Failed to handle post-payment actions', {
                error: error.message,
                paymentId: payment.id,
            });
        }
    }
    async handleSuccessfulCharge(data) {
        const reference = data.reference;
        const payment = await this.repository.findByReference(reference);
        if (payment && !payment.isSuccessful()) {
            await this.repository.markAsVerified(reference, reference);
            await this.handlePostPaymentActions(payment);
        }
    }
    async handleFailedCharge(data) {
        const reference = data.reference;
        await this.repository.updatePaymentStatus(reference, Payment_1.PaymentStatus.FAILED);
    }
    async handleSuccessfulTransfer(data) {
        // Handle successful transfers (for payouts)
        logger_1.default.info('Transfer successful', { transferReference: data.reference });
    }
    async handleFailedTransfer(data) {
        // Handle failed transfers
        logger_1.default.error('Transfer failed', { transferReference: data.reference, reason: data.reason });
    }
    async getMonthlyRevenue() {
        // Get revenue for last 6 months
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const revenue = await this.repository.getTotalRevenue(startDate, endDate);
            months.push({
                month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                revenue: this.paystackService.convertFromKobo(revenue),
            });
        }
        return months;
    }
    async getTopCustomers() {
        // This is a simplified version - in production, you'd use a proper SQL query
        const allPayments = await this.repository.findAll({
            where: { status: Payment_1.PaymentStatus.SUCCESSFUL },
        });
        const customerMap = new Map();
        for (const payment of allPayments) {
            const userId = payment.userId;
            const user = await User_1.User.findByPk(userId);
            if (user) {
                const current = customerMap.get(userId) || {
                    userId,
                    email: user.email,
                    totalSpent: 0,
                };
                current.totalSpent += this.paystackService.convertFromKobo(payment.amount);
                customerMap.set(userId, current);
            }
        }
        return Array.from(customerMap.values())
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10);
    }
}
exports.PaymentService = PaymentService;
// Helper class for application errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
//# sourceMappingURL=PaymentService.js.map