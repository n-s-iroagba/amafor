
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ScoutReportAttributes {
    id: string;
    playerId: string;
    scoutId: string;
    reportType: string;
    reportUrl: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ScoutReportCreationAttributes extends Optional<ScoutReportAttributes, 'id'> { }

class ScoutReport extends Model<ScoutReportAttributes, ScoutReportCreationAttributes> implements ScoutReportAttributes {
    public id!: string;
    public playerId!: string;
    public scoutId!: string;
    public reportType!: string;
    public reportUrl!: string;
    public content!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ScoutReport.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        playerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        scoutId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        reportType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reportUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'scout_reports',
    }
);

export default ScoutReport;
