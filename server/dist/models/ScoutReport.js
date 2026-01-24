"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ScoutReport extends sequelize_1.Model {
}
ScoutReport.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    playerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    scoutId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    reportType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    reportUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: 'scout_reports',
});
exports.default = ScoutReport;
//# sourceMappingURL=ScoutReport.js.map