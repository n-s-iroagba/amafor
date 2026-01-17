import { Model, Optional } from 'sequelize';
export declare enum PatronTier {
    SPONSOR_GRAND_PATRON = "sponsor_grand_patron",
    PATRON = "patron",
    SUPPORTER = "supporter",
    ADVOCATE = "advocate",
    LEGEND = "legend"
}
export declare enum SubscriptionFrequency {
    MONTHLY = "monthly",
    YEARLY = "yearly",
    LIFETIME = "lifetime"
}
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    PAYMENT_FAILED = "payment_failed"
}
export interface PatronSubscriptionAttributes {
    id: string;
    patronId: string;
    tier: PatronTier;
    frequency: SubscriptionFrequency;
    amount: number;
    status: SubscriptionStatus;
    portraitUrl?: string;
    logoUrl?: string;
    displayName: string;
    message?: string;
    startedAt: Date;
    nextBillingDate?: Date;
    cancelledAt?: Date;
    paymentMethod?: string;
    paymentReference: string;
    metadata: Record<string, any>;
    createdAt: Date;
    endDate?: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface PatronSubscriptionCreationAttributes extends Optional<PatronSubscriptionAttributes, 'id' | 'createdAt' | 'endDate' | 'updatedAt' | 'status' | 'metadata'> {
}
export declare class PatronSubscription extends Model<PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes> implements PatronSubscriptionAttributes {
    id: string;
    patronId: string;
    tier: PatronTier;
    frequency: SubscriptionFrequency;
    amount: number;
    status: SubscriptionStatus;
    portraitUrl?: string;
    logoUrl?: string;
    displayName: string;
    message?: string;
    startedAt: Date;
    nextBillingDate?: Date;
    cancelledAt?: Date;
    paymentMethod?: string;
    paymentReference: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default PatronSubscription;
//# sourceMappingURL=PatronSubscription.d.ts.map