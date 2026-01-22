"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueStatistics = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class LeagueStatistics extends sequelize_1.Model {
}
exports.LeagueStatistics = LeagueStatistics;
LeagueStatistics.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    leagueId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'leagues',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    team: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    goalsFor: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    goalsAgainst: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    fixtureId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'fixtures',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    matchesPlayed: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    wins: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    draws: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    losses: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    points: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    goalDifference: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    homeGoalsFor: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    homeGoalsAgainst: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    awayGoalsFor: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    awayGoalsAgainst: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    form: {
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: true,
        validate: {
            len: [0, 5],
            is: /^[WDL]*$/i, // Only W (Win), D (Draw), L (Loss)
        },
    },
    cleanSheets: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    failedToScore: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    avgGoalsPerFixture: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    avgGoalsConcededPerFixture: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    lastFixtureDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'league_statistics',
    timestamps: true,
    indexes: [
        {
            name: 'league_statistics_leagueId_index',
            fields: ['leagueId'],
        },
        {
            name: 'league_statistics_team_index',
            fields: ['team'],
        },
        {
            name: 'league_statistics_league_team_index',
            fields: ['leagueId', 'team'],
            unique: true,
        },
        {
            name: 'league_statistics_points_index',
            fields: ['points'],
        },
        {
            name: 'league_statistics_goal_difference_index',
            fields: ['goalDifference'],
        },
    ],
    hooks: {
        beforeValidate: (statistic) => {
            // Calculate goal difference
            statistic.goalDifference = statistic.goalsFor - statistic.goalsAgainst;
            // Calculate points (3 for win, 1 for draw)
            statistic.points = (statistic.wins || 0) * 3 + (statistic.draws || 0);
            // Calculate matches played if not provided
            if (!statistic.matchesPlayed) {
                statistic.matchesPlayed =
                    (statistic.wins || 0) +
                        (statistic.draws || 0) +
                        (statistic.losses || 0);
            }
            // Calculate averages if matches played > 0
            if (statistic.matchesPlayed > 0) {
                statistic.avgGoalsPerFixture = Number((statistic.goalsFor / statistic.matchesPlayed).toFixed(2));
                statistic.avgGoalsConcededPerFixture = Number((statistic.goalsAgainst / statistic.matchesPlayed).toFixed(2));
            }
        },
    },
});
exports.default = LeagueStatistics;
//# sourceMappingURL=LeagueStatistics.js.map