import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentType {
    ADVERTISEMENT = "advertisement",
    DONATION = "donation",
    SUBSCRIPTION = "subscription"
}
export declare enum PaymentProvider {
    PAYSTACK = "paystack",
    FLUTTERWAVE = "flutterwave",
    STRIPE = "stripe",
    MANUAL = "manual"
}
export declare enum Currency {
    NGN = "NGN",
    USD = "USD",
    GBP = "GBP",
    EUR = "EUR"
}
export interface PaymentAttributes {
    id: string;
    userId: string;
    reference: string;
    providerReference: string | null;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    type: PaymentType;
    provider: PaymentProvider;
    metadata: Record<string, any> | null;
    adCampaignId: string | null;
    subscriptionId: string | null;
    customerEmail: string;
    customerName: string | null;
    customerPhone: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    verifiedAt: Date | null;
    refundedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export type PaymentCreationAttributes = Omit<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'verifiedAt' | 'refundedAt'> & {
    id?: string;
    verifiedAt?: Date | null;
    refundedAt?: Date | null;
};
export declare class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
    id: CreationOptional<string>;
    userId: string;
    reference: string;
    providerReference: CreationOptional<string | null>;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    type: PaymentType;
    provider: PaymentProvider;
    metadata: CreationOptional<Record<string, any> | null>;
    adCampaignId: string | null;
    subscriptionId: string | null;
    customerEmail: string;
    customerName: CreationOptional<string | null>;
    customerPhone: CreationOptional<string | null>;
    ipAddress: CreationOptional<string | null>;
    userAgent: CreationOptional<string | null>;
    verifiedAt: CreationOptional<Date | null>;
    refundedAt: CreationOptional<Date | null>;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    static findByReference(reference: string): Promise<Payment | null>;
    static findByProviderReference(providerReference: string): Promise<Payment | null>;
    static getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number>;
    isSuccessful(): boolean;
    isPending(): boolean;
    isRefundable(): boolean;
    getFormattedAmount(): string;
}
export default Payment;
//# sourceMappingURL=Payment.d.ts.map