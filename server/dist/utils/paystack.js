"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaystackHealth = exports.handleSubscriptionWebhook = exports.handleDonationWebhook = exports.validateWebhookPayload = exports.mapSubscriptionStatus = exports.mapPaymentStatus = exports.generateReference = exports.verifyWebhookSignature = exports.createSubscription = exports.initiateTransfer = exports.createTransferRecipient = exports.verifyPayment = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("./logger");
const tracer_1 = require("./tracer");
const Donation_1 = require("@models/Donation");
const PatronSubscription_1 = require("@models/PatronSubscription");
// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxx';
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_xxxx';
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';
// Create axios instance for Paystack API
const paystackClient = axios_1.default.create({
    baseURL: PAYSTACK_BASE_URL,
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});
// Initialize payment
const initializePayment = async (request) => {
    return tracer_1.tracer.startActiveSpan('paystack.initializePayment', async (span) => {
        try {
            span.setAttributes({
                'paystack.email': request.email,
                'paystack.amount': request.amount,
                'paystack.currency': request.currency || 'NGN',
            });
            const response = await paystackClient.post('/transaction/initialize', {
                email: request.email,
                amount: request.amount * 100, // Convert to kobo
                currency: request.currency || 'NGN',
                reference: request.reference || (0, exports.generateReference)(),
                metadata: request.metadata,
                callback_url: request.callback_url,
            });
            span.setAttributes({
                'paystack.status': response.data.status,
                'paystack.reference': response.data.data.reference,
            });
            logger_1.logger.info('Payment initialized', {
                email: request.email,
                amount: request.amount,
                reference: response.data.data.reference,
            });
            return response.data;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error initializing payment', {
                error: error.response?.data || error.message,
                request,
            });
            throw new Error(`Payment initialization failed: ${error.message}`);
        }
        finally {
            span.end();
        }
    });
};
exports.initializePayment = initializePayment;
// Verify payment
const verifyPayment = async (reference) => {
    return tracer_1.tracer.startActiveSpan('paystack.verifyPayment', async (span) => {
        try {
            span.setAttribute('paystack.reference', reference);
            const response = await paystackClient.get(`/transaction/verify/${reference}`);
            span.setAttributes({
                'paystack.status': response.data.status,
                'paystack.payment_status': response.data.data.status,
                'paystack.amount': response.data.data.amount / 100,
            });
            logger_1.logger.info('Payment verified', {
                reference,
                status: response.data.data.status,
                amount: response.data.data.amount / 100,
            });
            return response.data;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error verifying payment', {
                error: error.response?.data || error.message,
                reference,
            });
            throw new Error(`Payment verification failed: ${error.message}`);
        }
        finally {
            span.end();
        }
    });
};
exports.verifyPayment = verifyPayment;
// Create transfer recipient
const createTransferRecipient = async (request) => {
    return tracer_1.tracer.startActiveSpan('paystack.createTransferRecipient', async (span) => {
        try {
            span.setAttributes({
                'paystack.recipient_name': request.name,
                'paystack.bank_code': request.bank_code,
                'paystack.account_number': request.account_number,
            });
            const response = await paystackClient.post('/transferrecipient', request);
            span.setAttributes({
                'paystack.status': response.data.status,
                'paystack.recipient_code': response.data.data.recipient_code,
            });
            logger_1.logger.info('Transfer recipient created', {
                name: request.name,
                account_number: request.account_number,
                recipient_code: response.data.data.recipient_code,
            });
            return response.data;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error creating transfer recipient', {
                error: error.response?.data || error.message,
                request,
            });
            throw new Error(`Transfer recipient creation failed: ${error.message}`);
        }
        finally {
            span.end();
        }
    });
};
exports.createTransferRecipient = createTransferRecipient;
// Initiate transfer
const initiateTransfer = async (request) => {
    return tracer_1.tracer.startActiveSpan('paystack.initiateTransfer', async (span) => {
        try {
            span.setAttributes({
                'paystack.amount': request.amount,
                'paystack.recipient': request.recipient,
                'paystack.reason': request.reason,
            });
            const response = await paystackClient.post('/transfer', {
                source: request.source,
                amount: request.amount * 100, // Convert to kobo
                recipient: request.recipient,
                reason: request.reason,
                reference: request.reference || (0, exports.generateReference)(),
            });
            span.setAttributes({
                'paystack.status': response.data.status,
                'paystack.transfer_code': response.data.data.transfer_code,
                'paystack.transfer_status': response.data.data.status,
            });
            logger_1.logger.info('Transfer initiated', {
                amount: request.amount,
                recipient: request.recipient,
                transfer_code: response.data.data.transfer_code,
            });
            return response.data;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error initiating transfer', {
                error: error.response?.data || error.message,
                request,
            });
            throw new Error(`Transfer initiation failed: ${error.message}`);
        }
        finally {
            span.end();
        }
    });
};
exports.initiateTransfer = initiateTransfer;
// Create subscription
const createSubscription = async (request) => {
    return tracer_1.tracer.startActiveSpan('paystack.createSubscription', async (span) => {
        try {
            span.setAttributes({
                'paystack.customer': request.customer,
                'paystack.plan': request.plan,
            });
            const response = await paystackClient.post('/subscription', request);
            span.setAttributes({
                'paystack.status': response.data.status,
                'paystack.subscription_code': response.data.data.subscription_code,
                'paystack.subscription_status': response.data.data.status,
            });
            logger_1.logger.info('Subscription created', {
                customer: request.customer,
                plan: request.plan,
                subscription_code: response.data.data.subscription_code,
            });
            return response.data;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error creating subscription', {
                error: error.response?.data || error.message,
                request,
            });
            throw new Error(`Subscription creation failed: ${error.message}`);
        }
        finally {
            span.end();
        }
    });
};
exports.createSubscription = createSubscription;
// Verify webhook signature
const verifyWebhookSignature = (payload, signature) => {
    return tracer_1.tracer.startActiveSpan('paystack.verifyWebhookSignature', (span) => {
        try {
            const hash = crypto_1.default
                .createHmac('sha512', PAYSTACK_SECRET_KEY)
                .update(JSON.stringify(payload))
                .digest('hex');
            const isValid = hash === signature;
            span.setAttributes({
                'paystack.webhook_signature_valid': isValid,
            });
            if (!isValid) {
                logger_1.logger.warn('Invalid webhook signature', {
                    expected: signature,
                    actual: hash,
                });
            }
            return isValid;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error verifying webhook signature', { error });
            return false;
        }
        finally {
            span.end();
        }
    });
};
exports.verifyWebhookSignature = verifyWebhookSignature;
// Generate unique reference
const generateReference = (prefix = 'AGFC') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
};
exports.generateReference = generateReference;
// Map Paystack status to donation status
const mapPaymentStatus = (paystackStatus) => {
    switch (paystackStatus.toLowerCase()) {
        case 'success':
            return Donation_1.DonationStatus.COMPLETED;
        case 'failed':
            return Donation_1.DonationStatus.FAILED;
        case 'abandoned':
            return Donation_1.DonationStatus.FAILED;
        default:
            return Donation_1.DonationStatus.PENDING;
    }
};
exports.mapPaymentStatus = mapPaymentStatus;
// Map Paystack status to subscription status
const mapSubscriptionStatus = (paystackStatus) => {
    switch (paystackStatus.toLowerCase()) {
        case 'active':
            return PatronSubscription_1.SubscriptionStatus.ACTIVE;
        case 'cancelled':
            return PatronSubscription_1.SubscriptionStatus.CANCELLED;
        case 'expired':
            return PatronSubscription_1.SubscriptionStatus.EXPIRED;
        case 'failed':
            return PatronSubscription_1.SubscriptionStatus.PAYMENT_FAILED;
        default:
            return PatronSubscription_1.SubscriptionStatus.ACTIVE;
    }
};
exports.mapSubscriptionStatus = mapSubscriptionStatus;
// Validate webhook payload
const validateWebhookPayload = (payload) => {
    try {
        if (!payload || typeof payload !== 'object') {
            return { isValid: false };
        }
        const { event, data } = payload;
        if (!event || !data) {
            return { isValid: false };
        }
        return {
            isValid: true,
            event,
            data,
            reference: data.reference,
        };
    }
    catch (error) {
        logger_1.logger.error('Error validating webhook payload', { error, payload });
        return { isValid: false };
    }
};
exports.validateWebhookPayload = validateWebhookPayload;
// Handle donation webhook
const handleDonationWebhook = async (payload) => {
    return tracer_1.tracer.startActiveSpan('paystack.handleDonationWebhook', async (span) => {
        try {
            const { event, data } = payload;
            span.setAttributes({
                'paystack.webhook_event': event,
                'paystack.reference': data.reference,
                'paystack.amount': data.amount / 100,
                'paystack.customer_email': data.customer?.email,
            });
            if (event !== 'charge.success' && event !== 'charge.failed') {
                return {
                    success: false,
                    reference: data.reference,
                    status: Donation_1.DonationStatus.PENDING,
                };
            }
            const status = (0, exports.mapPaymentStatus)(data.status);
            logger_1.logger.info('Processing donation webhook', {
                event,
                reference: data.reference,
                status,
                amount: data.amount / 100,
            });
            return {
                success: true,
                reference: data.reference,
                status,
            };
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error handling donation webhook', {
                error,
                payload,
            });
            return {
                success: false,
                reference: payload.data?.reference || 'unknown',
                status: Donation_1.DonationStatus.PENDING,
            };
        }
        finally {
            span.end();
        }
    });
};
exports.handleDonationWebhook = handleDonationWebhook;
// Handle subscription webhook
const handleSubscriptionWebhook = async (payload) => {
    return tracer_1.tracer.startActiveSpan('paystack.handleSubscriptionWebhook', async (span) => {
        try {
            const { event, data } = payload;
            span.setAttributes({
                'paystack.webhook_event': event,
                'paystack.subscription_code': data.subscription_code,
                'paystack.customer_email': data.customer?.email,
            });
            if (!event.includes('subscription.')) {
                return {
                    success: false,
                    reference: data.reference || 'unknown',
                    status: PatronSubscription_1.SubscriptionStatus.ACTIVE,
                };
            }
            const status = (0, exports.mapSubscriptionStatus)(data.status);
            logger_1.logger.info('Processing subscription webhook', {
                event,
                subscription_code: data.subscription_code,
                status,
            });
            return {
                success: true,
                subscriptionCode: data.subscription_code,
                reference: data.reference || 'unknown',
                status,
            };
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error handling subscription webhook', {
                error,
                payload,
            });
            return {
                success: false,
                reference: payload.data?.reference || 'unknown',
                status: PatronSubscription_1.SubscriptionStatus.ACTIVE,
            };
        }
        finally {
            span.end();
        }
    });
};
exports.handleSubscriptionWebhook = handleSubscriptionWebhook;
// Check Paystack service health
const checkPaystackHealth = async () => {
    return tracer_1.tracer.startActiveSpan('paystack.checkHealth', async (span) => {
        try {
            const startTime = Date.now();
            await paystackClient.get('/transaction/totals');
            const latency = Date.now() - startTime;
            span.setAttributes({
                'paystack.healthy': true,
                'paystack.latency_ms': latency,
            });
            return {
                healthy: true,
                latency,
            };
        }
        catch (error) {
            span.setAttributes({
                'paystack.healthy': false,
                'paystack.error': error.message,
            });
            return {
                healthy: false,
                error: error.message,
            };
        }
        finally {
            span.end();
        }
    });
};
exports.checkPaystackHealth = checkPaystackHealth;
// Export all paystack utilities
exports.default = {
    initializePayment: exports.initializePayment,
    verifyPayment: exports.verifyPayment,
    createTransferRecipient: exports.createTransferRecipient,
    initiateTransfer: exports.initiateTransfer,
    createSubscription: exports.createSubscription,
    verifyWebhookSignature: exports.verifyWebhookSignature,
    generateReference: exports.generateReference,
    mapPaymentStatus: exports.mapPaymentStatus,
    mapSubscriptionStatus: exports.mapSubscriptionStatus,
    validateWebhookPayload: exports.validateWebhookPayload,
    handleDonationWebhook: exports.handleDonationWebhook,
    handleSubscriptionWebhook: exports.handleSubscriptionWebhook,
    checkPaystackHealth: exports.checkPaystackHealth,
    PAYSTACK_PUBLIC_KEY,
    PAYSTACK_SECRET_KEY,
    PAYSTACK_BASE_URL,
};
//# sourceMappingURL=paystack.js.map