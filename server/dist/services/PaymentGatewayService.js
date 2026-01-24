"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackService = void 0;
exports.getPaystackService = getPaystackService;
// services/paystack/PaystackService.ts
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("@utils/logger"));
class PaystackService {
    constructor(config) {
        this.secretKey = config.secretKey;
        this.publicKey = config.publicKey;
        this.baseUrl = config.baseUrl || 'https://api.paystack.co';
    }
    getHeaders() {
        return {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
        };
    }
    async initializePayment(data) {
        try {
            const reference = data.reference || `PAY-${Date.now()}-${(0, uuid_1.v4)().substr(0, 8)}`;
            const payload = {
                email: data.email,
                amount: data.amount,
                reference,
                currency: data.currency || 'NGN',
                metadata: data.metadata || {},
                callback_url: data.callback_url,
                channels: data.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
            };
            logger_1.default.info('Initializing Paystack payment', { reference, amount: data.amount });
            const response = await axios_1.default.post(`${this.baseUrl}/transaction/initialize`, payload, { headers: this.getHeaders() });
            if (!response.data.status) {
                throw new Error(`Paystack error: ${response.data.message}`);
            }
            logger_1.default.info('Paystack payment initialized successfully', { reference });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to initialize Paystack payment', {
                error: error.message,
                data,
            });
            throw error;
        }
    }
    async verifyPayment(reference) {
        try {
            logger_1.default.info('Verifying Paystack payment', { reference });
            const response = await axios_1.default.get(`${this.baseUrl}/transaction/verify/${reference}`, { headers: this.getHeaders() });
            if (!response.data.status) {
                throw new Error(`Paystack verification error: ${response.data.message}`);
            }
            logger_1.default.info('Paystack payment verified', {
                reference,
                status: response.data.data.status,
                amount: response.data.data.amount,
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to verify Paystack payment', {
                error: error.message,
                reference,
            });
            throw error;
        }
    }
    async createTransferRecipient(data) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/transferrecipient`, data, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to create transfer recipient', {
                error: error.message,
                data,
            });
            throw error;
        }
    }
    async initiateTransfer(data) {
        try {
            const reference = data.reference || `TRF-${Date.now()}-${(0, uuid_1.v4)().substr(0, 8)}`;
            const payload = {
                source: data.source,
                amount: data.amount,
                recipient: data.recipient,
                reason: data.reason,
                reference,
            };
            const response = await axios_1.default.post(`${this.baseUrl}/transfer`, payload, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to initiate transfer', {
                error: error.message,
                data,
            });
            throw error;
        }
    }
    async verifyWebhookSignature(payload, signature) {
        try {
            const hash = crypto_1.default
                .createHmac('sha512', this.secretKey)
                .update(JSON.stringify(payload))
                .digest('hex');
            return hash === signature;
        }
        catch (error) {
            logger_1.default.error('Failed to verify webhook signature', { error });
            return false;
        }
    }
    async listBanks(country = 'nigeria') {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/bank`, {
                params: { country },
                headers: this.getHeaders(),
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to list banks', { error: error.message, country });
            throw error;
        }
    }
    async resolveAccountNumber(accountNumber, bankCode) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/bank/resolve`, {
                params: { account_number: accountNumber, bank_code: bankCode },
                headers: this.getHeaders(),
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to resolve account number', {
                error: error.message,
                accountNumber,
                bankCode,
            });
            throw error;
        }
    }
    // Utility methods
    convertToKobo(amount) {
        return Math.round(amount * 100); // Convert Naira to Kobo
    }
    convertFromKobo(amount) {
        return amount / 100; // Convert Kobo to Naira
    }
    generateReference(prefix = 'PAY') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
}
exports.PaystackService = PaystackService;
// Singleton instance
let paystackInstance = null;
function getPaystackService() {
    if (!paystackInstance) {
        paystackInstance = new PaystackService({
            secretKey: process.env.PAYSTACK_SECRET_KEY,
            publicKey: process.env.PAYSTACK_PUBLIC_KEY,
        });
    }
    return paystackInstance;
}
exports.default = getPaystackService;
//# sourceMappingURL=PaymentGatewayService.js.map