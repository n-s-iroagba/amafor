import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AcademyAttendanceAttributes {
    id: string;
    sessionId: string;
    attendeeId: string;
    attendeeName: string;
    status: 'present' | 'absent' | 'pending';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AcademyAttendanceCreationAttributes extends Optional<AcademyAttendanceAttributes, 'id' | 'attendeeName'> { }

export class AcademyAttendance extends Model<AcademyAttendanceAttributes, AcademyAttendanceCreationAttributes> implements AcademyAttendanceAttributes {
    public id!: string;
    public sessionId!: string;
    public attendeeId!: string; // Polymorphic reference (Player or Trialist)
    public attendeeName!: string;
    public status!: 'present' | 'absent' | 'pending';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

AcademyAttendance.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sessionId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        attendeeId: {
            type: DataTypes.STRING, // Using STRING to accommodate both UUID and sequential IDs if any
            allowNull: false,
        },
        attendeeName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('present', 'absent', 'pending'),
            defaultValue: 'pending',
        }
    },
    {
        sequelize,
        tableName: 'academy_attendance',
    }
);

export default AcademyAttendance;
