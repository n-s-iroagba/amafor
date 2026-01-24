import { Model } from 'sequelize';
export interface DisputeAttributes {
    id: string;
    advertiserId: string;
    subject: string;
    description: string;
    status: 'open' | 'investigation' | 'resolved' | 'closed';
    adminResponse?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface DisputeCreationAttributes extends Omit<DisputeAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Dispute extends Model<DisputeAttributes, DisputeCreationAttributes> implements DisputeAttributes {
    id: string;
    advertiserId: string;
    subject: string;
    description: string;
    status: 'open' | 'investigation' | 'resolved' | 'closed';
    adminResponse?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Dispute;
//# sourceMappingURL=Dispute.d.ts.map