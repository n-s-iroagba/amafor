export interface InitializePaymentResponse {
    access_code: string
    reference: string
    authorizationUrl: string
}

export interface PaymentPayload {
    email: string;
    amount: string; // Amount in kobo/cents as string
    currency?: string;
    metadata?: Record<string, any>;
    callback_url?: string;
    channels?: string[];
}

export enum PaymentType {
    SUBSCRIPTION = 'subscription',
    DONATION = 'donation'
}