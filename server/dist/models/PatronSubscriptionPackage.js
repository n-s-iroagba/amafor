"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronSubscriptionPackage = exports.SubscriptionStatus = exports.SubscriptionFrequency = exports.PatronTier = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
var PatronTier;
(function (PatronTier) {
    PatronTier["SPONSOR_GRAND_PATRON"] = "sponsor_grand_patron";
    PatronTier["PATRON"] = "patron";
    PatronTier["SUPPORTER"] = "supporter";
})(PatronTier || (exports.PatronTier = PatronTier = {}));
var SubscriptionFrequency;
(function (SubscriptionFrequency) {
    SubscriptionFrequency["MONTHLY"] = "monthly";
    SubscriptionFrequency["YEARLY"] = "yearly";
    SubscriptionFrequency["LIFETIME"] = "lifetime";
})(SubscriptionFrequency || (exports.SubscriptionFrequency = SubscriptionFrequency = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["PAYMENT_FAILED"] = "payment_failed";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
class PatronSubscriptionPackage extends sequelize_1.Model {
}
exports.PatronSubscriptionPackage = PatronSubscriptionPackage;
PatronSubscriptionPackage.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    benefits: {
        type: sequelize_1.DataTypes.JSON,
    },
    tier: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PatronTier)),
        allowNull: false
    },
    frequency: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(SubscriptionFrequency)),
        allowNull: false
    },
    miniumumAmount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
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
        { fields: ['tier'] },
        { fields: ['status'] },
        { fields: ['frequency'] },
        { fields: ['createdAt'] }
    ]
});
exports.default = PatronSubscriptionPackage;
//# sourceMappingURL=PatronSubscriptionPackage.js.map