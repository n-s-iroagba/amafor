"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trialist = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Trialist extends sequelize_1.Model {
}
exports.Trialist = Trialist;
Trialist.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dob: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    preferredFoot: {
        type: sequelize_1.DataTypes.ENUM('LEFT', 'RIGHT', 'BOTH'),
        allowNull: false,
    },
    height: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    weight: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    previousClub: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    videoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        validate: { isUrl: true },
    },
    cvUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    guardianName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    guardianPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    guardianEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    consentEmail: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    consentSmsWhatsapp: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    guardianConsent: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('PENDING', 'REVIEWED', 'INVITED', 'REJECTED'),
        defaultValue: 'PENDING',
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'trialists',
});
exports.default = Trialist;
//# sourceMappingURL=Trialist.js.map