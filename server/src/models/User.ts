import sequelize from '@config/database';
import { DataTypes, Model, Optional } from 'sequelize';

export type UserRole = 'admin' | 'scout' | 'advertiser';

export enum UserStatus {
  ACTIVE = 'active',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended'
}

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  metadata: Record<string, any>;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'emailVerified' | 'metadata' | 'loginAttempts'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public avatarUrl?: string;
  public role!: UserRole;
  public status!: UserStatus;
  public emailVerified!: boolean;
  public verificationToken?: string;
  public verificationTokenExpires?: Date;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
  public metadata!: Record<string, any>;
  public lastLogin?: Date;
  public loginAttempts!: number;
  public lockUntil?: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;
  public advertiserProfile?: any; // Added to avoid lint errors with includes
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'scout', 'advertiser'),
      allowNull: false,
      defaultValue: 'advertiser',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.PENDING_VERIFICATION,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default User;