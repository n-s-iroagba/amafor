"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/FixtureStatistics.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class FixtureStatistics extends sequelize_1.Model {
}
FixtureStatistics.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    fixtureId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'fixtures',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    homePossession: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 50,
        validate: { min: 0, max: 100 }
    },
    awayPossession: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 50,
        validate: { min: 0, max: 100 }
    },
    homeShots: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    awayShots: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    homeShotsOnTarget: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    awayShotsOnTarget: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    homeCorners: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    awayCorners: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    homeFouls: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    awayFouls: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    homeYellowCards: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    awayYellowCards: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    homeRedCards: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    awayRedCards: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    homeOffsides: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    awayOffsides: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    tableName: 'fixture_statistics',
    timestamps: true
});
exports.default = FixtureStatistics;
//# sourceMappingURL=FixtureStatistics.js.map