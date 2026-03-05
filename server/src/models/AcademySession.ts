import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AcademySessionAttributes {
    id: string;
    date: Date;
    title: string;
    type: 'training' | 'trial' | 'match';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AcademySessionCreationAttributes extends Optional<AcademySessionAttributes, 'id'> { }

export class AcademySession extends Model<AcademySessionAttributes, AcademySessionCreationAttributes> implements AcademySessionAttributes {
    public id!: string;
    public date!: Date;
    public title!: string;
    public type!: 'training' | 'trial' | 'match';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

AcademySession.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('training', 'trial', 'match'),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'academy_sessions',
    }
);

export default AcademySession;
