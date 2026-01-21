import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define attributes
export interface TrialistAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  position: string;
  preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
  height?: number; // in cm
  weight?: number; // in kg
  previousClub?: string;
  videoUrl?: string; // Link to highlight reel
  cvUrl?: string; // Link to resume
  status: 'PENDING' | 'REVIEWED' | 'INVITED' | 'REJECTED';
  notes?: string; // Internal scout notes
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes (id is optional as it's auto-generated)
export interface TrialistCreationAttributes extends Optional<TrialistAttributes, 'id' | 'status' | 'notes'> {}

export class Trialist extends Model<TrialistAttributes, TrialistCreationAttributes> implements TrialistAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public dob!: Date;
  public position!: string;
  public preferredFoot!: 'LEFT' | 'RIGHT' | 'BOTH';
  public height?: number;
  public weight?: number;
  public previousClub?: string;
  public videoUrl?: string;
  public cvUrl?: string;
  public status!: 'PENDING' | 'REVIEWED' | 'INVITED' | 'REJECTED';
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trialist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferredFoot: {
      type: DataTypes.ENUM('LEFT', 'RIGHT', 'BOTH'),
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    previousClub: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'REVIEWED', 'INVITED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'trialists',
  }
);
export default  Trialist