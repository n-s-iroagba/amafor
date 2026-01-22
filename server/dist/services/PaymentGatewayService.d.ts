export interface PaystackConfig {
    secretKey: string;
    publicKey: string;
    baseUrl?: string;
}
export interface InitializePaymentData {
    email: string;
    amount: number;
    reference?: string;
    currency?: string;
    metadata?: Record<string, any>;
    callback_url?: string;
    channels?: string[];
}
export interface PaymentResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}
export interface VerifyPaymentResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: Record<string, any>;
        customer: {
            id: number;
            email: string;
            customer_code: string;
            first_name: string | null;
            last_name: string | null;
            phone: string | null;
        };
        authorization: Record<string, any>;
    };
}
export interface TransferRecipientData {
    type: string;
    name: string;
    account_number: string;
    bank_code: string;
    currency?: string;
}
export interface TransferData {
    source: string;
    amount: number;
    recipient: string;
    reason: string;
    reference?: string;
}
export declare class PaystackService {
    private readonly baseUrl;
    private readonly secretKey;
    private readonly publicKey;
    constructor(config: PaystackConfig);
    private getHeaders;
    initializePayment(data: InitializePaymentData): Promise<PaymentResponse>;
    verifyPayment(reference: string): Promise<VerifyPaymentResponse>;
    createTransferRecipient(data: TransferRecipientData): Promise<any>;
    initiateTransfer(data: TransferData): Promise<any>;
    verifyWebhookSignature(payload: any, signature: string): Promise<boolean>;
    listBanks(country?: string): Promise<any>;
    resolveAccountNumber(accountNumber: string, bankCode: string): Promise<any>;
    convertToKobo(amount: number): number;
    convertFromKobo(amount: number): number;
    generateReference(prefix?: string): string;
}
export declare function getPaystackService(): PaystackService;
//# sourceMappingURL=PaymentGatewayService.d.ts.map