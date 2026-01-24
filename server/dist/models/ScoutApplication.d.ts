import { Model, Optional } from 'sequelize';
export declare enum ApplicationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export interface ScoutApplicationAttributes {
    id: string;
    name: string;
    email: string;
    organization: string;
    socialUrl: string;
    reason: string;
    status: ApplicationStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ScoutApplicationCreationAttributes extends Optional<ScoutApplicationAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
}
export declare class ScoutApplication extends Model<ScoutApplicationAttributes, ScoutApplicationCreationAttributes> implements ScoutApplicationAttributes {
    id: string;
    name: string;
    email: string;
    organization: string;
    socialUrl: string;
    reason: string;
    status: ApplicationStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export default ScoutApplication;
//# sourceMappingURL=ScoutApplication.d.ts.map