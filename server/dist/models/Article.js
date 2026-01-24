"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = exports.ArticleStatus = exports.ArticleTag = void 0;
const database_1 = __importDefault(require("@config/database"));
const sequelize_1 = require("sequelize");
var ArticleTag;
(function (ArticleTag) {
    ArticleTag["FOOTBALL_NEWS"] = "football_news";
    ArticleTag["MATCH_REPORT"] = "match_report";
    ArticleTag["ACADEMY_UPDATE"] = "academy_update";
    ArticleTag["ACADEMY"] = "academy";
    ArticleTag["PLAYER_SPOTLIGHT"] = "player_spotlight";
    ArticleTag["CLUB_ANNOUNCEMENT"] = "club_announcement";
})(ArticleTag || (exports.ArticleTag = ArticleTag = {}));
var ArticleStatus;
(function (ArticleStatus) {
    ArticleStatus["DRAFT"] = "draft";
    ArticleStatus["SCHEDULED"] = "scheduled";
    ArticleStatus["PUBLISHED"] = "published";
    ArticleStatus["ARCHIVED"] = "archived";
})(ArticleStatus || (exports.ArticleStatus = ArticleStatus = {}));
class Article extends sequelize_1.Model {
}
exports.Article = Article;
Article.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false
    },
    content: {
        type: sequelize_1.DataTypes.TEXT('long'),
        allowNull: false
    },
    excerpt: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    featuredImage: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    tags: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    authorId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    viewCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    readTime: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Estimated read time in minutes'
    },
    videoEmbedUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    videoProvider: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn: [['youtube', 'vimeo']]
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ArticleStatus)),
        allowNull: false,
        defaultValue: ArticleStatus.DRAFT
    },
    scheduledPublishAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    publishedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    adZones: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    }, createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    sequelize: database_1.default,
    tableName: 'articles',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['title'] },
        { fields: ['status'] },
        { fields: ['publishedAt'] },
        { fields: ['createdAt'] },
        { fields: ['authorId'] }
    ]
});
exports.default = Article;
//# sourceMappingURL=Article.js.map