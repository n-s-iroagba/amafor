"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreative = void 0;
// models/AdCreative.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// 3. Define Class with Sequelize Types
class AdCreative extends sequelize_1.Model {
}
exports.AdCreative = AdCreative;
AdCreative.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    campaignId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    zoneId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'ad_zones',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    url: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    destinationUrl: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['image', 'video']]
        }
    },
    format: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [['jpg', 'png', 'mp4', 'gif']]
        }
    },
    dimensions: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    views: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    numberOfViews: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    }
}, {
    tableName: 'ad_creatives',
    sequelize: database_1.default,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['campaignId']
        },
        {
            fields: ['zoneId']
        },
        {
            fields: ['type']
        }
    ]
});
exports.default = AdCreative;
//# sourceMappingURL=AdCreative.js.map