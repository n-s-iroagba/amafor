import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

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

export interface DisputeCreationAttributes extends Omit<DisputeAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class Dispute extends Model<DisputeAttributes, DisputeCreationAttributes> implements DisputeAttributes {
    public id!: string;
    public advertiserId!: string;
    public subject!: string;
    public description!: string;
    public status!: 'open' | 'investigation' | 'resolved' | 'closed';
    public adminResponse?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Dispute.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        advertiserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users', // Assuming table name
                key: 'id',
            },
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('open', 'investigation', 'resolved', 'closed'),
            defaultValue: 'open',
        },
        adminResponse: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'disputes',
        timestamps: true,
    }
);

Dispute.belongsTo(User, { foreignKey: 'advertiserId', as: 'advertiser' });

export default Dispute;
