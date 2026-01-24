import { IPaymentRepository } from '@repositories/PaymentRepository';
import { PaymentAttributes, PaymentType, Currency } from '@models/Payment';
export interface CreateAdvertisementPaymentData {
    userId: string;
    adCampaignId: string;
    amount: number;
    currency?: Currency;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
export interface CreatePatronSubscriptionPaymentData {
    userId: string;
    subscriptionId?: string;
    amount: number;
    currency?: Currency;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
export interface PaymentInitiationResult {
    payment: PaymentAttributes;
    paymentUrl: string;
    reference: string;
}
export interface PaymentVerificationResult {
    payment: PaymentAttributes;
    isSuccessful: boolean;
    message: string;
}
export interface RevenueStats {
    totalRevenue: number;
    revenueByType: Record<PaymentType, number>;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
    }>;
    topCustomers: Array<{
        userId: string;
        email: string;
        totalSpent: number;
    }>;
}
export declare class PaymentService {
    private repository;
    private paystackService;
    constructor(repository?: IPaymentRepository);
    createAdvertisementPayment(data: CreateAdvertisementPaymentData): Promise<PaymentInitiationResult>;
    createDonationPayment(data: CreatePatronSubscriptionPaymentData): Promise<PaymentInitiationResult>;
    verifyPayment(reference: string): Promise<PaymentVerificationResult>;
    handleWebhook(payload: any, signature: string): Promise<void>;
    getPaymentById(id: string): Promise<PaymentAttributes>;
    getUserPayments(userId: string, page?: number, limit?: number): Promise<{
        payments: PaymentAttributes[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }>;
    getPaymentStats(startDate?: Date, endDate?: Date): Promise<{
        total: number;
        successful: number;
        pending: number;
        failed: number;
        totalAmount: number;
    }>;
    getPaymentsByAdvertiser(userId: string): Promise<PaymentAttributes[]>;
    getAllPayments(options: {
        page: number;
        limit: number;
        status?: string;
        type?: string;
    }): Promise<any>;
    getRevenueStats(): Promise<RevenueStats>;
    refundPayment(id: string): Promise<PaymentAttributes>;
    private generateReference;
    private mapPaystackStatus;
    private handlePostPaymentActions;
    private handleSuccessfulCharge;
    private handleFailedCharge;
    private handleSuccessfulTransfer;
    private handleFailedTransfer;
    private getMonthlyRevenue;
    private getTopCustomers;
}
//# sourceMappingURL=PaymentService.d.ts.map