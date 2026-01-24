"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.Currency = exports.PaymentProvider = exports.PaymentType = exports.PaymentStatus = void 0;
// models/Payment.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCESSFUL"] = "successful";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["ADVERTISEMENT"] = "advertisement";
    PaymentType["DONATION"] = "donation";
    PaymentType["SUBSCRIPTION"] = "subscription";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["PAYSTACK"] = "paystack";
    PaymentProvider["FLUTTERWAVE"] = "flutterwave";
    PaymentProvider["STRIPE"] = "stripe";
    PaymentProvider["MANUAL"] = "manual";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
var Currency;
(function (Currency) {
    Currency["NGN"] = "NGN";
    Currency["USD"] = "USD";
    Currency["GBP"] = "GBP";
    Currency["EUR"] = "EUR";
})(Currency || (exports.Currency = Currency = {}));
// Main Payment model
class Payment extends sequelize_1.Model {
    // Static methods
    static async findByReference(reference) {
        return await this.findOne({ where: { reference } });
    }
    static async findByProviderReference(providerReference) {
        return await this.findOne({ where: { providerReference } });
    }
    static async getTotalRevenue(startDate, endDate) {
        const where = { status: PaymentStatus.SUCCESSFUL };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.$gte = startDate;
            if (endDate)
                where.createdAt.$lte = endDate;
        }
        const result = await this.sum('amount', { where });
        return result || 0;
    }
    // Instance methods
    isSuccessful() {
        return this.status === PaymentStatus.SUCCESSFUL;
    }
    isPending() {
        return this.status === PaymentStatus.PENDING;
    }
    isRefundable() {
        return this.isSuccessful() && !this.refundedAt;
    }
    getFormattedAmount() {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: this.currency,
        }).format(this.amount / 100);
    }
}
exports.Payment = Payment;
// Model initialization
Payment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    reference: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    providerReference: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        field: 'provider_reference',
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    currency: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(Currency)),
        allowNull: false,
        defaultValue: Currency.NGN,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentType)),
        allowNull: false,
    },
    provider: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentProvider)),
        allowNull: false,
        defaultValue: PaymentProvider.PAYSTACK,
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
    },
    adCampaignId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'ad_campaigns',
            key: 'id',
        },
    },
    subscriptionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'patron_subscriptions',
            key: 'id',
        },
    },
    customerEmail: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true,
        },
        field: 'customer_email',
    },
    customerName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'customer_name',
    },
    customerPhone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'customer_phone',
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
    },
    userAgent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent',
    },
    verifiedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'verified_at',
    },
    refundedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'refunded_at',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at',
    },
}, {
    tableName: 'payments',
    sequelize: database_1.default,
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
});
exports.default = Payment;
//# sourceMappingURL=Payment.js.map