import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum PatronTier {
  SPONSOR_GRAND_PATRON = 'sponsor_grand_patron',
  PATRON = 'patron',
  SUPPORTER = 'supporter',
  ADVOCATE = 'advocate',
  LEGEND = 'legend'
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

export interface PatronSubscriptionAttributes {
  id: string;
  patronId: string;
  tier: PatronTier;
  frequency: SubscriptionFrequency;
  amount: number;
  status: SubscriptionStatus;
  portraitUrl?: string;
  logoUrl?: string;
  displayName: string;
  message?: string;
  startedAt: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  paymentMethod?: string;
  paymentReference: string;
  metadata: Record<string, any>;
  createdAt: Date;
  endDate?:Date,
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PatronSubscriptionCreationAttributes extends Optional<PatronSubscriptionAttributes, 'id' | 'createdAt' |'endDate' | 'updatedAt' | 'status' | 'metadata'> {}

export class PatronSubscription extends Model<PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes> implements PatronSubscriptionAttributes {
  public id!: string;
  public patronId!: string;
  public tier!: PatronTier;
  public frequency!: SubscriptionFrequency;
  public amount!: number;
  public status!: SubscriptionStatus;
  public portraitUrl?: string;
  public logoUrl?: string;
  public displayName!: string;
  public message?: string;
  public startedAt!: Date;
  public nextBillingDate?: Date;
  public cancelledAt?: Date;
  public paymentMethod?: string;
  public paymentReference!: string;
  public metadata!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
  static associate(models: any) {
    PatronSubscription.belongsTo(models.User, { foreignKey: 'patronId', as: 'user' });
  }

  static initModel(sequelize: Sequelize): typeof PatronSubscription {
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
        frequency: {
          type: DataTypes.ENUM(...Object.values(SubscriptionFrequency)),
          allowNull: false
        },
        amount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM(...Object.values(SubscriptionStatus)),
          allowNull: false,
          defaultValue: SubscriptionStatus.ACTIVE
        },
        portraitUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        logoUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        displayName: {
          type: DataTypes.STRING(200),
          allowNull: false
        },
        message: {
          type: DataTypes.TEXT,
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
        paymentMethod: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            isIn: [['card', 'bank_transfer', 'mobile_money']]
          }
        },
        paymentReference: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        },
        createdAt: {
          type:DataTypes.DATE
        },
        updatedAt: {
          type:DataTypes.DATE
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

    return PatronSubscription;
  }
}

export default PatronSubscription;