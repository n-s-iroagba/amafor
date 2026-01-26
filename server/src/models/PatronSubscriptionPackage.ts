import sequelize from '../config/database';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum PatronTier {
  SPONSOR_GRAND_PATRON = 'sponsor_grand_patron',
  PATRON = 'patron',
  SUPPORTER = 'supporter',

}

export enum SubscriptionFrequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAYMENT_FAILED = 'payment_failed'
}



export interface PatronSubscriptionPackageAttributes {
  id: string;

  tier: PatronTier;
  frequency: SubscriptionFrequency;
  miniumumAmount: number;
  benefits: string[]
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PatronSubscriptionPackageCreationAttributes extends Optional<PatronSubscriptionPackageAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class PatronSubscriptionPackage extends Model<PatronSubscriptionPackageAttributes, PatronSubscriptionPackageCreationAttributes> implements PatronSubscriptionPackageAttributes {
  public id!: string;

  public tier!: PatronTier;
  public frequency!: SubscriptionFrequency;
  public miniumumAmount!: number;
  public benefits!: string[];
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
}


PatronSubscriptionPackage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    benefits: {
      type: DataTypes.JSON,
    },
    tier: {
      type: DataTypes.ENUM(...Object.values(PatronTier)),
      allowNull: false
    },
    frequency: {
      type: DataTypes.ENUM(...Object.values(SubscriptionFrequency)),
      allowNull: false
    },
    miniumumAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
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
    tableName: 'patron_subscription_packages',
    timestamps: true,
    paranoid: true,
    indexes: [

      { fields: ['tier'] },
      { fields: ['frequency'] },
      { fields: ['createdAt'] }
    ]
  }
);



export default PatronSubscriptionPackage;