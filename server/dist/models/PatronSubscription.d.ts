import { Model, Optional } from 'sequelize';
export interface PatronSubscriptionAttributes {
    id: string;
    patronId: string;
    amount: number;
    startedAt: Date;
    nextBillingDate?: Date;
    cancelledAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    endDate?: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface PatronSubscriptionCreationAttributes extends Optional<PatronSubscriptionAttributes, 'id' | 'createdAt' | 'endDate' | 'updatedAt' | 'metadata'> {
}
export declare class PatronSubscription extends Model<PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes> implements PatronSubscriptionAttributes {
    id: string;
    patronId: string;
    amount: number;
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