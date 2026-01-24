"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const PaymentService_1 = require("@services/PaymentService");
const logger_1 = __importDefault(require("@utils/logger"));
class PaymentController {
    constructor() {
        this.paymentService = new PaymentService_1.PaymentService();
    }
    /**
     * Initiate advertisement payment
     * @api POST /payments/advertisement
     * @apiName API-PAYMENT-006
     * @apiGroup Payments
     * @srsRequirement REQ-ADV-04
     */
    async initiateAdvertisementPayment(req, res) {
        try {
            const data = {
                userId: req.user.id,
                adCampaignId: req.body.adCampaignId,
                amount: parseFloat(req.body.amount),
                currency: req.body.currency,
                customerEmail: req.body.email || req.user.email,
                customerName: req.body.name || `${req.user.firstName} ${req.user.lastName}`,
                customerPhone: req.body.phone,
                metadata: req.body.metadata,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
            };
            const result = await this.paymentService.createAdvertisementPayment(data);
            res.status(200).json({
                success: true,
                message: 'Payment initiated successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to initiate advertisement payment', {
                error: error.message,
                userId: req.user.id,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to initiate payment',
            });
        }
    }
    /**
     * Initiate donation payment
     * @api POST /payments/donation
     * @apiName API-PAYMENT-007
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-01
     */
    async initiateDonationPayment(req, res) {
        try {
            const data = {
                userId: req.user.id,
                subscriptionId: req.body.subscriptionId,
                amount: parseFloat(req.body.amount),
                currency: req.body.currency,
                customerEmail: req.body.email || req.user.email,
                customerName: req.body.name || `${req.user.firstName} ${req.user.lastName}`,
                customerPhone: req.body.phone,
                metadata: req.body.metadata,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
            };
            const result = await this.paymentService.createDonationPayment(data);
            res.status(200).json({
                success: true,
                message: 'Donation payment initiated successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to initiate donation payment', {
                error: error.message,
                userId: req.user.id,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to initiate donation payment',
            });
        }
    }
    /**
     * Verify payment
     * @api POST /payments/verify/:reference
     * @apiName API-PAYMENT-004
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-01, REQ-SUP-02, REQ-ADV-04
     */
    async verifyPayment(req, res) {
        try {
            const { reference } = req.params;
            const result = await this.paymentService.verifyPayment(reference);
            res.status(200).json({
                success: true,
                message: 'Payment verification completed',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to verify payment', {
                error: error.message,
                reference: req.params.reference,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to verify payment',
            });
        }
    }
    /**
     * Handle payment webhook
     * @api POST /payments/webhook
     * @apiName API-PAYMENT-005
     * @apiGroup Payments
     * @srsRequirement REQ-ADV-04
     */
    async handleWebhook(req, res) {
        try {
            const signature = req.headers['x-paystack-signature'];
            await this.paymentService.handleWebhook(req.body, signature);
            res.status(200).json({ success: true, message: 'Webhook processed' });
        }
        catch (error) {
            logger_1.default.error('Failed to process webhook', {
                error: error.message,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to process webhook',
            });
        }
    }
    /**
     * Get payment details
     * @api GET /payments/:id
     * @apiName API-PAYMENT-008
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    async getPaymentDetails(req, res) {
        try {
            const { id } = req.params;
            const payment = await this.paymentService.getPaymentById(id);
            res.status(200).json({
                success: true,
                data: payment,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get payment details', {
                error: error.message,
                paymentId: req.params.id,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to get payment details',
            });
        }
    }
    /**
     * Get user payments
     * @api GET /payments/user
     * @apiName API-PAYMENT-009
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-03
     */
    async getUserPayments(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const userId = req.user.id;
            const result = await this.paymentService.getUserPayments(userId, parseInt(page), parseInt(limit));
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get user payments', {
                error: error.message,
                userId: req.user.id,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to get user payments',
            });
        }
    }
    /**
     * Get payment statistics
     * @api GET /payments/stats
     * @apiName API-PAYMENT-010
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    async getPaymentStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await this.paymentService.getPaymentStats(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get payment stats', { error: error.message });
            res.status(500).json({
                success: false,
                message: 'Failed to get payment stats',
            });
        }
    }
    /**
     * Refund payment
     * @api POST /payments/:id/refund
     * @apiName API-PAYMENT-011
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    async refundPayment(req, res) {
        try {
            const { id } = req.params;
            const payment = await this.paymentService.refundPayment(id);
            res.status(200).json({
                success: true,
                message: 'Payment refunded successfully',
                data: payment,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to refund payment', {
                error: error.message,
                paymentId: req.params.id,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to refund payment',
            });
        }
    }
    /**
     * Get advertiser payments
     * @api GET /payments/advertiser
     * @apiName API-PAYMENT-001
     * @apiGroup Payments
     * @srsRequirement REQ-ADV-05
     */
    async getAdvertiserPayments(req, res) {
        try {
            const advertiserId = req.user.id;
            const payments = await this.paymentService.getPaymentsByAdvertiser(advertiserId);
            res.status(200).json({
                success: true,
                message: 'Advertiser payments retrieved successfully',
                data: payments,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to retrieve advertiser payments', {
                error: error.message,
                advertiserId: req.user.id,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to retrieve advertiser payments',
            });
        }
    }
    /**
     * Get all payments (admin)
     * @api GET /payments
     * @apiName API-PAYMENT-002
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    async getAllPayments(req, res) {
        try {
            const { page = 1, limit = 20, status, type } = req.query;
            const payments = await this.paymentService.getAllPayments({
                page: Number(page),
                limit: Number(limit),
                status: status,
                type: type,
            });
            res.status(200).json({
                success: true,
                message: 'All payments retrieved successfully',
                data: payments,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to retrieve all payments', {
                error: error.message,
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to retrieve all payments',
            });
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=PaymentController.js.map