"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispute = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = require("./User");
class Dispute extends sequelize_1.Model {
}
exports.Dispute = Dispute;
Dispute.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    advertiserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // Assuming table name
            key: 'id',
        },
    },
    subject: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('open', 'investigation', 'resolved', 'closed'),
        defaultValue: 'open',
    },
    adminResponse: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'disputes',
    timestamps: true,
});
Dispute.belongsTo(User_1.User, { foreignKey: 'advertiserId', as: 'advertiser' });
exports.default = Dispute;
//# sourceMappingURL=Dispute.js.map