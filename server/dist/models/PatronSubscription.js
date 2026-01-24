"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronSubscription = exports.SubscriptionFrequency = exports.SubscriptionStatus = exports.PatronTier = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
var PatronTier;
(function (PatronTier) {
    PatronTier["SPONSOR_GRAND_PATRON"] = "sponsor_grand_patron";
    PatronTier["PATRON"] = "patron";
    PatronTier["SUPPORTER"] = "supporter";
    PatronTier["ADVOCATE"] = "advocate";
    PatronTier["LEGEND"] = "legend";
})(PatronTier || (exports.PatronTier = PatronTier = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["PAYMENT_FAILED"] = "payment_failed";
    SubscriptionStatus["PENDING"] = "pending";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var SubscriptionFrequency;
(function (SubscriptionFrequency) {
    SubscriptionFrequency["MONTHLY"] = "monthly";
    SubscriptionFrequency["YEARLY"] = "yearly";
    SubscriptionFrequency["LIFETIME"] = "lifetime";
})(SubscriptionFrequency || (exports.SubscriptionFrequency = SubscriptionFrequency = {}));
class PatronSubscription extends sequelize_1.Model {
}
exports.PatronSubscription = PatronSubscription;
PatronSubscription.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    patronId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    tier: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PatronTier)),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(SubscriptionStatus)),
        allowNull: false,
        defaultValue: SubscriptionStatus.PENDING
    },
    frequency: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(SubscriptionFrequency)),
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    paymentReference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true // Can be null initially before payment
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    displayName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    portraitUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    logoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    startedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    nextBillingDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    cancelledAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    sequelize: database_1.default,
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
});
exports.default = PatronSubscription;
//# sourceMappingURL=PatronSubscription.js.map