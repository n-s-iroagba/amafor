// models/Payment.ts
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentType {
  ADVERTISEMENT = 'advertisement',
  DONATION = 'donation',
  SUBSCRIPTION = 'subscription'
}

export enum PaymentProvider {
  PAYSTACK = 'paystack',
  FLUTTERWAVE = 'flutterwave',
  STRIPE = 'stripe',
  MANUAL = 'manual'
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  GBP = 'GBP',
  EUR = 'EUR'
}

// Interface for attributes
export interface PaymentAttributes {
  id: string;
  userId: string;
  reference: string;
  providerReference: string | null;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  type: PaymentType;
  provider: PaymentProvider;
  metadata: Record<string, any> | null;
  adCampaignId: string | null;
  subscriptionId: string | null;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  verifiedAt: Date | null;
  refundedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creation attributes
export type PaymentCreationAttributes = Omit<
  PaymentAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'verifiedAt' | 'refundedAt'
> & {
  id?: string;
  verifiedAt?: Date | null;
  refundedAt?: Date | null;
};

// Main Payment model
export class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  declare id: CreationOptional<string>;
  declare userId: string; // Ensure this is present
  declare reference: string;
  declare providerReference: CreationOptional<string | null>;
  declare amount: number;
  declare currency: Currency;
  declare status: PaymentStatus;
  declare type: PaymentType;
  declare provider: PaymentProvider;
  declare metadata: CreationOptional<Record<string, any> | null>;

  // FIX: Explicitly allow null for these optional foreign keys
  declare adCampaignId: string | null;
  declare subscriptionId: string | null;

  declare customerEmail: string;
  declare customerName: CreationOptional<string | null>;
  declare customerPhone: CreationOptional<string | null>;
  declare ipAddress: CreationOptional<string | null>;
  declare userAgent: CreationOptional<string | null>;
  declare verifiedAt: CreationOptional<Date | null>;
  declare refundedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Static methods
  static async findByReference(reference: string): Promise<Payment | null> {
    return await this.findOne({ where: { reference } });
  }

  static async findByProviderReference(providerReference: string): Promise<Payment | null> {
    return await this.findOne({ where: { providerReference } });
  }

  static async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    const where: any = { status: PaymentStatus.SUCCESSFUL };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.$gte = startDate;
      if (endDate) where.createdAt.$lte = endDate;
    }

    const result = await this.sum('amount', { where });
    return result || 0;
  }

  // Instance methods
  isSuccessful(): boolean {
    return this.status === PaymentStatus.SUCCESSFUL;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  isRefundable(): boolean {
    return this.isSuccessful() && !this.refundedAt;
  }

  getFormattedAmount(): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount / 100);
  }
}

// Model initialization
Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    providerReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      field: 'provider_reference',
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    currency: {
      type: DataTypes.ENUM(...Object.values(Currency)),
      allowNull: false,
      defaultValue: Currency.NGN,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PaymentType)),
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM(...Object.values(PaymentProvider)),
      allowNull: false,
      defaultValue: PaymentProvider.PAYSTACK,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    adCampaignId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ad_campaigns',
        key: 'id',
      },
    },
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'patron_subscriptions',
        key: 'id',
      },
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      field: 'customer_email',
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'customer_name',
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'customer_phone',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'refunded_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    tableName: 'payments',
    sequelize,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      { fields: ['reference'], unique: true },
      { fields: ['provider_reference'], unique: true },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['created_at'] },
    ],
    validate: {
      checkPaymentType() {
        if (this.type === PaymentType.ADVERTISEMENT && !this.adCampaignId) {
          throw new Error('Ad campaign ID is required for advertisement payments');
        }
        if (this.type === PaymentType.SUBSCRIPTION && !this.subscriptionId) {
          throw new Error('Subscription ID is required for subscription payments');
        }
      },
    },
  }
);

export default Payment;