"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedSource = exports.RssFeedSourceCategory = void 0;
// models/RssFeedSource.ts (Simplified)
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var RssFeedSourceCategory;
(function (RssFeedSourceCategory) {
    RssFeedSourceCategory["SPORTS"] = "sports";
    RssFeedSourceCategory["GENERAL"] = "general";
    RssFeedSourceCategory["BUSINESS"] = "business";
    RssFeedSourceCategory["ENTERTAINMENT"] = "entertainment";
    RssFeedSourceCategory["NIGERIA"] = "nigeria";
})(RssFeedSourceCategory = exports.RssFeedSourceCategory || (exports.RssFeedSourceCategory = {}));
class RssFeedSource extends sequelize_1.Model {
}
exports.RssFeedSource = RssFeedSource;
RssFeedSource.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    feedUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        unique: true,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    category: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(RssFeedSourceCategory)),
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    tableName: 'rss_feed_sources',
    sequelize: database_1.default,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});
exports.default = RssFeedSource;
//# sourceMappingURL=RssFeedSource.js.map