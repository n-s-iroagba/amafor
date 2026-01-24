"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fixture = exports.ArchiveStatus = exports.FixtureStatus = void 0;
// models/Fixture.ts
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
var FixtureStatus;
(function (FixtureStatus) {
    FixtureStatus["SCHEDULED"] = "scheduled";
    FixtureStatus["IN_PROGRESS"] = "in_progress";
    FixtureStatus["COMPLETED"] = "completed";
    FixtureStatus["POSTPONED"] = "postponed";
    FixtureStatus["CANCELLED"] = "cancelled";
})(FixtureStatus || (exports.FixtureStatus = FixtureStatus = {}));
var ArchiveStatus;
(function (ArchiveStatus) {
    ArchiveStatus["PROCESSING"] = "processing";
    ArchiveStatus["AVAILABLE"] = "available";
    ArchiveStatus["FAILED"] = "failed";
})(ArchiveStatus || (exports.ArchiveStatus = ArchiveStatus = {}));
class Fixture extends sequelize_1.Model {
}
exports.Fixture = Fixture;
Fixture.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    matchDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    homeTeam: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    awayTeam: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    leagueId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'leagues',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    venue: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(FixtureStatus)),
        allowNull: false,
        defaultValue: FixtureStatus.SCHEDULED
    },
    homeScore: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    awayScore: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    attendance: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    referee: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true
    },
    weather: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    matchReportArticleId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    highlightsUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    archiveStatus: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ArchiveStatus)),
        allowNull: false,
        defaultValue: ArchiveStatus.PROCESSING
    },
    availableAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    videoUrl: {
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
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
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
    tableName: 'fixtures',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['matchDate'] },
        { fields: ['status'] },
        { fields: ['leagueId'] }, // CORRECTED: Changed 'competition' to 'leagueId'
        { fields: ['createdAt'] }
    ]
});
exports.default = Fixture;
//# sourceMappingURL=Fixture.js.map