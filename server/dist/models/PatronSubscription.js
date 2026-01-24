"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronSubscription = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
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
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
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