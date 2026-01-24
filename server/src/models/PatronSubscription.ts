import sequelize from '../config/database';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';



export enum PatronTier {
  SPONSOR_GRAND_PATRON = 'sponsor_grand_patron',
  PATRON = 'patron',
  SUPPORTER = 'supporter',
  ADVOCATE = 'advocate',
  LEGEND = 'legend'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAYMENT_FAILED = 'payment_failed',
  PENDING = 'pending'
}

export enum SubscriptionFrequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

export interface PatronSubscriptionAttributes {
  id: string;
  patronId: string;
  tier: PatronTier;
  status: SubscriptionStatus;
  frequency: SubscriptionFrequency;
  amount: number;
  paymentReference: string;
  paymentMethod?: string;
  displayName?: string;
  message?: string;
  portraitUrl?: string;
  logoUrl?: string;

  startedAt: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  endDate?: Date,
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PatronSubscriptionCreationAttributes extends Optional<PatronSubscriptionAttributes, 'id' | 'createdAt' | 'endDate' | 'updatedAt' | 'metadata' | 'paymentReference' | 'paymentMethod' | 'displayName' | 'message' | 'portraitUrl' | 'logoUrl'> { }

export class PatronSubscription extends Model<PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes> implements PatronSubscriptionAttributes {
  public id!: string;
  public patronId!: string;
  public tier!: PatronTier;
  public status!: SubscriptionStatus;
  public frequency!: SubscriptionFrequency;
  public amount!: number;
  public paymentReference!: string;
  public paymentMethod?: string;
  public displayName?: string;
  public message?: string;
  public portraitUrl?: string;
  public logoUrl?: string;

  public startedAt!: Date;
  public nextBillingDate?: Date;
  public cancelledAt?: Date;

  public metadata!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
}


PatronSubscription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patronId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tier: {
      type: DataTypes.ENUM(...Object.values(PatronTier)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SubscriptionStatus)),
      allowNull: false,
      defaultValue: SubscriptionStatus.PENDING
    },
    frequency: {
      type: DataTypes.ENUM(...Object.values(SubscriptionFrequency)),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true // Can be null initially before payment
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    portraitUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    nextBillingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'patron_subscriptions',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['patronId'] },
      { fields: ['tier'] },
      { fields: ['status'] },
      { fields: ['frequency'] },
      { fields: ['createdAt'] }
    ]
  }
);



export default PatronSubscription;