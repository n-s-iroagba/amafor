import sequelize from '@config/database';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum UserType {
  FAN = 'fan',
  SCOUT = 'scout',
  ADVERTISER = 'advertiser',
  PATRON = 'patron',
  DONOR = 'donor',
  MEDIA_MANAGER = 'media_manager',
  SPORTS_ADMIN = 'sports_admin',
  DATA_STEWARD = 'data_steward',
  COMMERCIAL_MANAGER = 'commercial_manager',
  IT_SECURITY = 'it_security',
  SUPER_ADMIN = 'super_admin'
}

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
  userType: UserType;
  roles: string[];
  status: UserStatus;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  metadata: Record<string, any>;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date|null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'status' | 'emailVerified' | 'metadata' | 'loginAttempts'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public avatarUrl?: string;
  public userType!: UserType;
  public roles!: string[];
  public status!: UserStatus;
  public emailVerified!: boolean;
  public verificationToken?: string;
  public verificationTokenExpires?: Date;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
  public metadata!: Record<string, any>;
  public lastLogin?: Date;
  public loginAttempts!: number;
  public lockUntil?: Date|null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;




  }


    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        firstName: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        lastName: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        phone: {
          type: DataTypes.STRING(20),
          allowNull: true
        },
        avatarUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        userType: {
          type: DataTypes.ENUM(...Object.values(UserType)),
          allowNull: false,
          defaultValue: UserType.FAN
        },
        roles: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: []
        },
        status: {
          type: DataTypes.ENUM(...Object.values(UserStatus)),
          allowNull: false,
          defaultValue: UserStatus.PENDING_VERIFICATION
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        verificationToken: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        verificationTokenExpires: {
          type: DataTypes.DATE,
          allowNull: true
        },
        passwordResetToken: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        passwordResetExpires: {
          type: DataTypes.DATE,
          allowNull: true
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true
        },
        loginAttempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        lockUntil: {
          type: DataTypes.DATE,
          allowNull: true
        }, createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
 
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['email'], unique: true },
          { fields: ['userType'] },
          { fields: ['status'] },
          { fields: ['createdAt'] }
        ]
      }
    );


export default User;