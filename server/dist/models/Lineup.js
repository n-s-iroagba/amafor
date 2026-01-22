"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lineup = void 0;
// models/Lineup.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// Main Lineup model
class Lineup extends sequelize_1.Model {
    // Instance methods
    isCaptain() {
        return this.captain;
    }
    isSubstitute() {
        return !this.isStarter;
    }
    getPositionCategory() {
        const positionMap = {
            'GK': 'Goalkeeper',
            'RB': 'Defender',
            'CB': 'Defender',
            'LB': 'Defender',
            'RWB': 'Defender',
            'LWB': 'Defender',
            'CDM': 'Midfielder',
            'CM': 'Midfielder',
            'CAM': 'Midfielder',
            'RM': 'Midfielder',
            'LM': 'Midfielder',
            'RW': 'Forward',
            'LW': 'Forward',
            'CF': 'Forward',
            'ST': 'Forward'
        };
        return positionMap[this.position] || 'Unknown';
    }
    // Static methods
    static async getFixtureLineup(fixtureId) {
        return await this.findAll({
            where: { fixtureId },
            order: [
                ['isStarter', 'DESC'],
                ['position', 'ASC'],
                ['jerseyNumber', 'ASC']
            ]
        });
    }
    static async getPlayerFixtures(playerId) {
        return await this.findAll({
            where: { playerId },
            order: [['createdAt', 'DESC']]
        });
    }
}
exports.Lineup = Lineup;
// Model initialization
Lineup.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    fixtureId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'fixtures',
            key: 'id',
        },
        field: 'fixture_id',
        onDelete: 'CASCADE'
    },
    playerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'players',
            key: 'id',
        },
        field: 'player_id',
        onDelete: 'CASCADE'
    },
    position: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['GK', 'RB', 'CB', 'LB', 'RWB', 'LWB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'CF', 'ST']]
        }
    },
    isStarter: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_starter'
    },
    jerseyNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 99
        },
        field: 'jersey_number'
    },
    captain: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'lineups',
    sequelize: database_1.default,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['fixture_id'] },
        { fields: ['player_id'] },
        { fields: ['position'] },
        { fields: ['is_starter'] },
        { fields: ['jersey_number'] },
        { fields: ['captain'] },
        { unique: true, fields: ['fixture_id', 'player_id'] } // Prevent duplicate players in same fixture
    ],
    hooks: {
        beforeCreate: async (lineup) => {
            // Ensure only one captain per team per fixture
            if (lineup.captain) {
                const existingCaptain = await Lineup.findOne({
                    where: {
                        fixtureId: lineup.fixtureId,
                        captain: true
                    }
                });
                if (existingCaptain) {
                    throw new Error('Only one captain allowed per team per fixture');
                }
            }
            // Ensure jersey number is unique for the fixture
            if (lineup.jerseyNumber) {
                const existingJersey = await Lineup.findOne({
                    where: {
                        fixtureId: lineup.fixtureId,
                        jerseyNumber: lineup.jerseyNumber
                    }
                });
                if (existingJersey) {
                    throw new Error(`Jersey number ${lineup.jerseyNumber} is already taken for this fixture`);
                }
            }
        }
    }
});
exports.default = Lineup;
//# sourceMappingURL=Lineup.js.map