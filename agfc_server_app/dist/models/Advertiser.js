"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Advertiser.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Advertiser extends sequelize_1.Model {
}
Advertiser.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    companyName: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
    },
    contactPerson: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    website: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    industry: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: 'advertisers',
    modelName: 'Advertiser',
    indexes: [
        { fields: ['email'] },
        { fields: ['status'] }
    ]
});
exports.default = Advertiser;
//# sourceMappingURL=Advertiser.js.map