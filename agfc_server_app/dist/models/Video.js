"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Video.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Video extends sequelize_1.Model {
}
Video.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    excerpt: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    thumbnail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    videoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
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
    tableName: 'videos',
});
exports.default = Video;
//# sourceMappingURL=Video.js.map