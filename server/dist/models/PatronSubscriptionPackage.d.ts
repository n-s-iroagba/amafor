import { Model, Optional } from 'sequelize';
export declare enum PatronTier {
    SPONSOR_GRAND_PATRON = "sponsor_grand_patron",
    PATRON = "patron",
    SUPPORTER = "supporter"
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
export interface PatronSubscriptionPackageAttributes {
    id: string;
    tier: PatronTier;
    frequency: SubscriptionFrequency;
    miniumumAmount: number;
    benefits: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface PatronSubscriptionPackageCreationAttributes extends Optional<PatronSubscriptionPackageAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class PatronSubscriptionPackage extends Model<PatronSubscriptionPackageAttributes, PatronSubscriptionPackageCreationAttributes> implements PatronSubscriptionPackageAttributes {
    id: string;
    tier: PatronTier;
    frequency: SubscriptionFrequency;
    miniumumAmount: number;
    benefits: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default PatronSubscriptionPackage;
//# sourceMappingURL=PatronSubscriptionPackage.d.ts.map