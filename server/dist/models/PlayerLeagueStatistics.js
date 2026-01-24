"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerLeagueStatistics = void 0;
const database_1 = __importDefault(require("@config/database"));
const sequelize_1 = require("sequelize");
class PlayerLeagueStatistics extends sequelize_1.Model {
}
exports.PlayerLeagueStatistics = PlayerLeagueStatistics;
PlayerLeagueStatistics.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    leagueId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'leagues',
            key: 'id',
        },
        onDelete: 'CASCADE'
    }, playerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'players',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    goals: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    assists: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    cleanSheets: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    yellowCards: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    redCards: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    minutesPlayed: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    createdById: {
        type: sequelize_1.DataTypes.UUID
    },
    updatedById: {
        type: sequelize_1.DataTypes.UUID
    }
}, {
    sequelize: database_1.default,
    tableName: 'player_league_statistics',
    timestamps: true,
});
exports.default = PlayerLeagueStatistics;
//# sourceMappingURL=PlayerLeagueStatistics.js.map