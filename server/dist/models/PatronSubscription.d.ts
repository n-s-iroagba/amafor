import { Model, Optional } from 'sequelize';
export declare enum PatronTier {
    SPONSOR_GRAND_PATRON = "sponsor_grand_patron",
    PATRON = "patron",
    SUPPORTER = "supporter",
    ADVOCATE = "advocate",
    LEGEND = "legend"
}
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    PAYMENT_FAILED = "payment_failed",
    PENDING = "pending"
}
export declare enum SubscriptionFrequency {
    MONTHLY = "monthly",
    YEARLY = "yearly",
    LIFETIME = "lifetime"
}
export interface PatronSubscriptionAttributes {
    id: string;
    patronId: string;
    tier: PatronTier;
    status: SubscriptionStatus;
    frequency: SubscriptionFrequency;
    amount: number;
    paymentReference: string;
    paymentMethod?: string;
    displayName?: string;
    message?: string;
    portraitUrl?: string;
    logoUrl?: string;
    startedAt: Date;
    nextBillingDate?: Date;
    cancelledAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    endDate?: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface PatronSubscriptionCreationAttributes extends Optional<PatronSubscriptionAttributes, 'id' | 'createdAt' | 'endDate' | 'updatedAt' | 'metadata' | 'paymentReference' | 'paymentMethod' | 'displayName' | 'message' | 'portraitUrl' | 'logoUrl'> {
}
export declare class PatronSubscription extends Model<PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes> implements PatronSubscriptionAttributes {
    id: string;
    patronId: string;
    tier: PatronTier;
    status: SubscriptionStatus;
    frequency: SubscriptionFrequency;
    amount: number;
    paymentReference: string;
    paymentMethod?: string;
    displayName?: string;
    message?: string;
    portraitUrl?: string;
    logoUrl?: string;
    startedAt: Date;
    nextBillingDate?: Date;
    cancelledAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default PatronSubscription;
//# sourceMappingURL=PatronSubscription.d.ts.map