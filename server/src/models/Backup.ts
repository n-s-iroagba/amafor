import {
    Model,
    DataTypes,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';

export enum BackupStatus {
    COMPLETED = 'completed',
    IN_PROGRESS = 'in_progress',
    FAILED = 'failed'
}

export enum BackupType {
    FULL = 'full',
    INCREMENTAL = 'incremental'
}

export class Backup extends Model<
    InferAttributes<Backup>,
    InferCreationAttributes<Backup>
> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare fileName: string;
    declare path: string;
    declare size: string; // e.g. "10.5 MB"
    declare status: BackupStatus;
    declare type: BackupType;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Backup.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'file_name'
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(BackupStatus)),
            allowNull: false,
            defaultValue: BackupStatus.IN_PROGRESS,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(BackupType)),
            allowNull: false,
            defaultValue: BackupType.FULL,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at'
        }
    },
    {
        tableName: 'backups',
        sequelize,
        timestamps: true,
    }
);

export default Backup;
