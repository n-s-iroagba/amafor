import sequelize from '../config/database';
import { DataTypes, Model, Optional } from 'sequelize';

export enum ApplicationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
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

export interface ScoutApplicationCreationAttributes extends Optional<ScoutApplicationAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> { }

export class ScoutApplication extends Model<ScoutApplicationAttributes, ScoutApplicationCreationAttributes> implements ScoutApplicationAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public organization!: string;
    public socialUrl!: string;
    public reason!: string;
    public status!: ApplicationStatus;
    public reviewedBy?: string;
    public reviewedAt?: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ScoutApplication.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    organization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    socialUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
        defaultValue: ApplicationStatus.PENDING
    },
    reviewedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'scout_applications',
    timestamps: true
});

export default ScoutApplication;
