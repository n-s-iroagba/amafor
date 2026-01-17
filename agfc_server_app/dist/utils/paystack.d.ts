import { DonationStatus } from '@models/Donation';
import { SubscriptionStatus } from '@models/PatronSubscription';
export interface PaymentInitializeRequest {
    email: string;
    amount: number;
    reference?: string;
    currency?: string;
    metadata?: Record<string, any>;
    callback_url?: string;
}
export interface PaymentInitializeResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}
export interface PaymentVerifyResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        paid_at: string;
        created_at: string;
        currency: string;
        channel: string;
        metadata: Record<string, any>;
        customer: {
            id: number;
            email: string;
            first_name: string;
            last_name: string;
            phone: string;
        };
    };
}
export interface TransferRecipientRequest {
    type: 'nuban';
    name: string;
    account_number: string;
    bank_code: string;
    currency?: string;
    description?: string;
}
export interface TransferRecipientResponse {
    status: boolean;
    message: string;
    data: {
        recipient_code: string;
        active: boolean;
        created_at: string;
        currency: string;
        domain: string;
        id: number;
        integration: number;
        name: string;
        type: string;
        updated_at: string;
        is_deleted: boolean;
        details: {
            authorization_code: string | null;
            account_number: string;
            account_name: string;
            bank_code: string;
            bank_name: string;
        };
    };
}
export interface TransferRequest {
    source: 'balance';
    amount: number;
    recipient: string;
    reason?: string;
    reference?: string;
}
export interface TransferResponse {
    status: boolean;
    message: string;
    data: {
        integration: number;
        domain: string;
        amount: number;
        currency: string;
        source: string;
        reason: string;
        recipient: number;
        status: string;
        transfer_code: string;
        id: number;
        created_at: string;
        updated_at: string;
        reference: string;
    };
}
export interface SubscriptionRequest {
    customer: string;
    plan: string;
    authorization: string;
    start_date?: string;
}
export interface SubscriptionResponse {
    status: boolean;
    message: string;
    data: {
        customer: number;
        plan: number;
        integration: number;
        domain: string;
        start: number;
        status: string;
        quantity: number;
        amount: number;
        subscription_code: string;
        email_token: string;
        authorization: Record<string, any>;
        id: number;
        created_at: string;
        updated_at: string;
    };
}
export declare const initializePayment: (request: PaymentInitializeRequest) => Promise<PaymentInitializeResponse>;
export declare const verifyPayment: (reference: string) => Promise<PaymentVerifyResponse>;
export declare const createTransferRecipient: (request: TransferRecipientRequest) => Promise<TransferRecipientResponse>;
export declare const initiateTransfer: (request: TransferRequest) => Promise<TransferResponse>;
export declare const createSubscription: (request: SubscriptionRequest) => Promise<SubscriptionResponse>;
export declare const verifyWebhookSignature: (payload: any, signature: string) => boolean;
export declare const generateReference: (prefix?: string) => string;
export declare const mapPaymentStatus: (paystackStatus: string) => DonationStatus;
export declare const mapSubscriptionStatus: (paystackStatus: string) => SubscriptionStatus;
export declare const validateWebhookPayload: (payload: any) => {
    isValid: boolean;
    event?: string;
    data?: any;
    reference?: string;
};
export declare const handleDonationWebhook: (payload: any) => Promise<{
    success: boolean;
    donationId?: string;
    reference: string;
    status: DonationStatus;
}>;
export declare const handleSubscriptionWebhook: (payload: any) => Promise<{
    success: boolean;
    subscriptionCode?: string;
    reference: string;
    status: SubscriptionStatus;
}>;
export declare const checkPaystackHealth: () => Promise<{
    healthy: boolean;
    latency?: number;
    error?: string;
}>;
declare const _default: {
    initializePayment: (request: PaymentInitializeRequest) => Promise<PaymentInitializeResponse>;
    verifyPayment: (reference: string) => Promise<PaymentVerifyResponse>;
    createTransferRecipient: (request: TransferRecipientRequest) => Promise<TransferRecipientResponse>;
    initiateTransfer: (request: TransferRequest) => Promise<TransferResponse>;
    createSubscription: (request: SubscriptionRequest) => Promise<SubscriptionResponse>;
    verifyWebhookSignature: (payload: any, signature: string) => boolean;
    generateReference: (prefix?: string) => string;
    mapPaymentStatus: (paystackStatus: string) => DonationStatus;
    mapSubscriptionStatus: (paystackStatus: string) => SubscriptionStatus;
    validateWebhookPayload: (payload: any) => {
        isValid: boolean;
        event?: string | undefined;
        data?: any;
        reference?: string | undefined;
    };
    handleDonationWebhook: (payload: any) => Promise<{
        success: boolean;
        donationId?: string | undefined;
        reference: string;
        status: DonationStatus;
    }>;
    handleSubscriptionWebhook: (payload: any) => Promise<{
        success: boolean;
        subscriptionCode?: string | undefined;
        reference: string;
        status: SubscriptionStatus;
    }>;
    checkPaystackHealth: () => Promise<{
        healthy: boolean;
        latency?: number | undefined;
        error?: string | undefined;
    }>;
    PAYSTACK_PUBLIC_KEY: any;
    PAYSTACK_SECRET_KEY: any;
    PAYSTACK_BASE_URL: any;
};
export default _default;
//# sourceMappingURL=paystack.d.ts.map