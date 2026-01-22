"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedNews = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const RssFeedSource_1 = require("./RssFeedSource");
// 3️⃣ Define the model class
class FeaturedNews extends sequelize_1.Model {
}
exports.FeaturedNews = FeaturedNews;
// 4️⃣ Initialize the model
FeaturedNews.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rss_feed_source_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RssFeedSource_1.RssFeedSource,
            key: 'id',
        },
    },
    original_id: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
    },
    summary: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    article_url: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
        validate: {
            isUrl: true,
        },
    },
    published_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    thumbnail_url: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
}, {
    tableName: 'third_party_articles',
    sequelize: database_1.default,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['rss_feed_source_id', 'original_id'],
        },
        {
            fields: ['published_at'],
        },
    ],
});
// 5️⃣ Define associations
FeaturedNews.belongsTo(RssFeedSource_1.RssFeedSource, {
    foreignKey: 'rss_feed_source_id',
    as: 'feed_source',
});
//# sourceMappingURL=FeaturedNews.js.map