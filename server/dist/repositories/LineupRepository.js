"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineupRepository = void 0;
// repositories/LineupRepository.ts
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const Lineup_1 = require("@models/Lineup");
const Fixture_1 = require("@models/Fixture");
const Player_1 = require("@models/Player");
class LineupRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Lineup_1.Lineup);
    }
    // 🔍 Find lineups by fixture ID
    async findByFixtureId(fixtureId) {
        return await this.findAll({
            where: { fixtureId },
            order: [
                ['isStarter', 'DESC'],
                ['position', 'ASC'],
                ['jerseyNumber', 'ASC']
            ],
            include: [
                { model: Player_1.Player, as: 'player', attributes: ['id', 'firstName', 'lastName', 'position'] }
            ]
        });
    }
    // 🔍 Find lineups by player ID
    async findByPlayerId(playerId) {
        return await this.findAll({
            where: { playerId },
            order: [['createdAt', 'DESC']],
            include: [
                { model: Fixture_1.Fixture, as: 'fixture', attributes: ['id', 'homeTeam', 'awayTeam', 'matchDate', 'competition'] }
            ]
        });
    }
    // 🔍 Find lineups by position
    async findByPosition(position) {
        return await this.findAll({
            where: { position },
            order: [['createdAt', 'DESC']]
        });
    }
    // 🔍 Find starting lineup
    async findStarters(fixtureId) {
        return await this.findAll({
            where: { fixtureId, isStarter: true },
            order: [
                ['position', 'ASC'],
                ['jerseyNumber', 'ASC']
            ],
            include: [
                { model: Player_1.Player, as: 'player', attributes: ['id', 'firstName', 'lastName', 'position', 'jerseyNumber'] }
            ]
        });
    }
    // 🔍 Find substitutes
    async findSubstitutes(fixtureId) {
        return await this.findAll({
            where: { fixtureId, isStarter: false },
            order: [['position', 'ASC']],
            include: [
                { model: Player_1.Player, as: 'player', attributes: ['id', 'firstName', 'lastName', 'position'] }
            ]
        });
    }
    // 🔍 Find captain for a fixture
    async findCaptain(fixtureId) {
        return await this.findOne({
            where: { fixtureId, captain: true },
            include: [
                { model: Player_1.Player, as: 'player', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });
    }
    // 📊 Get player appearances statistics
    async getPlayerAppearances(playerId) {
        const [starts, subs, total] = await Promise.all([
            this.count({ where: { playerId, isStarter: true } }),
            this.count({ where: { playerId, isStarter: false } }),
            this.count({ where: { playerId } })
        ]);
        return { starts, subs, total };
    }
    // 📊 Get fixture lineup statistics
    async getFixtureLineupStats(fixtureId) {
        const [totalPlayers, starters, substitutes, lineups] = await Promise.all([
            this.count({ where: { fixtureId } }),
            this.count({ where: { fixtureId, isStarter: true } }),
            this.count({ where: { fixtureId, isStarter: false } }),
            this.findByFixtureId(fixtureId)
        ]);
        const byPosition = {};
        lineups.forEach(lineup => {
            const position = lineup.position;
            byPosition[position] = (byPosition[position] || 0) + 1;
        });
        return {
            totalPlayers,
            starters,
            substitutes,
            byPosition
        };
    }
    // Alternative approach - directly use model.update
    async updatePlayerPosition(fixtureId, playerId, position) {
        const [affectedCount] = await this.model.update({ position }, { where: { fixtureId, playerId } });
        return affectedCount > 0;
    }
    // 🔄 Toggle starter/substitute status
    async toggleStarterStatus(id) {
        const lineup = await this.findById(id);
        if (!lineup) {
            return false;
        }
        // Call parent class update method with correct signature
        const [affectedCount] = await super.update(id, {
            isStarter: !lineup.isStarter
        });
        // Or use the model directly:
        // const [affectedCount] = await this.model.update(
        //   { isStarter: !lineup.isStarter },
        //   { where: { id } }
        // );
        return affectedCount > 0;
    }
    // ⭐ Set captain for fixture
    async setCaptain(fixtureId, playerId) {
        const transaction = await this.model.sequelize.transaction();
        try {
            // Remove captain from current captain
            await this.model.update({ captain: false }, { where: { fixtureId, captain: true }, transaction });
            // Set new captain
            const [affectedCount] = await this.model.update({ captain: true }, { where: { fixtureId, playerId }, transaction });
            await transaction.commit();
            return affectedCount > 0;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    // 🔄 Bulk create lineups for a fixture
    async bulkCreateForFixture(fixtureId, lineups) {
        // Validate fixture exists
        const fixture = await Fixture_1.Fixture.findByPk(fixtureId);
        if (!fixture) {
            throw new Error(`Fixture with ID ${fixtureId} not found`);
        }
        // Add fixtureId to each lineup
        const lineupsWithFixture = lineups.map(lineup => ({
            ...lineup,
            fixtureId
        }));
        return await this.bulkCreate(lineupsWithFixture);
    }
    // 🔄 Replace entire fixture lineup
    async replaceFixtureLineup(fixtureId, lineups) {
        const transaction = await this.model.sequelize.transaction();
        try {
            // Delete existing lineups
            await this.deleteByFixtureId(fixtureId);
            // Create new lineups
            const createdLineups = await this.bulkCreateForFixture(fixtureId, lineups);
            await transaction.commit();
            return createdLineups;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    // 🗑️ Delete all lineups for a fixture
    async deleteByFixtureId(fixtureId) {
        return await this.model.destroy({
            where: { fixtureId }
        });
    }
    // 🔍 Search lineups by player name
    async searchLineupsByPlayerName(query) {
        return await this.model.findAll({
            include: [{
                    model: Player_1.Player,
                    as: 'player',
                    where: {
                        [sequelize_1.Op.or]: [
                            { firstName: { [sequelize_1.Op.iLike]: `%${query}%` } },
                            { lastName: { [sequelize_1.Op.iLike]: `%${query}%` } }
                        ]
                    },
                    required: true
                }],
            order: [['createdAt', 'DESC']]
        });
    }
    // 🔍 Get lineups by team (home or away)
    async getLineupsByTeam(fixtureId, team) {
        const fixture = await Fixture_1.Fixture.findByPk(fixtureId);
        if (!fixture) {
            throw new Error(`Fixture with ID ${fixtureId} not found`);
        }
        const lineups = await this.findByFixtureId(fixtureId);
        if (!team) {
            return lineups;
        }
        // Filter by team (this assumes Player model has a teamId or similar field)
        // This is a simplified version - you might need to adjust based on your Player model
        const teamLineups = lineups.filter(lineup => {
            const player = lineup.player;
            if (!player)
                return false;
            // Assuming Player has a team property
            const playerTeam = player.team;
            if (team === 'home') {
                return playerTeam === fixture.homeTeam;
            }
            else {
                return playerTeam === fixture.awayTeam;
            }
        });
        return teamLineups;
    }
    // 🎯 Override create to validate player and fixture
    async create(data) {
        // Validate fixture exists
        const fixture = await Fixture_1.Fixture.findByPk(data.fixtureId);
        if (!fixture) {
            throw new Error(`Fixture with ID ${data.fixtureId} not found`);
        }
        // Validate player exists
        const player = await Player_1.Player.findByPk(data.playerId);
        if (!player) {
            throw new Error(`Player with ID ${data.playerId} not found`);
        }
        // Check if player already in lineup for this fixture
        const existingLineup = await this.findOne({
            where: { fixtureId: data.fixtureId, playerId: data.playerId }
        });
        if (existingLineup) {
            throw new Error(`Player ${data.playerId} is already in the lineup for fixture ${data.fixtureId}`);
        }
        return await super.create(data);
    }
    // 🎯 Override update to handle captain validation
    async update(id, data) {
        // If setting captain, ensure only one captain per fixture
        if (data.captain === true) {
            const lineup = await this.findById(id);
            if (lineup) {
                const transaction = await this.model.sequelize.transaction();
                try {
                    // Remove captain from current captain (excluding current record)
                    await this.model.update({ captain: false }, {
                        where: {
                            fixtureId: lineup.fixtureId,
                            captain: true,
                            id: { [sequelize_1.Op.ne]: id } // Don't update the current record
                        },
                        transaction
                    });
                    // Update the current lineup
                    const [affectedCount, updatedRecords] = await this.model.update(data, {
                        where: { id },
                        transaction,
                        returning: true
                    });
                    await transaction.commit();
                    return [affectedCount, updatedRecords];
                }
                catch (error) {
                    await transaction.rollback();
                    throw error;
                }
            }
        }
        // For non-captain updates, use the base method
        return await super.update(id, data);
    }
    // 🔧 Get formation for fixture
    async getFormation(fixtureId) {
        const starters = await this.findStarters(fixtureId);
        // Count players by position category
        const positionCounts = {
            'Defender': 0,
            'Midfielder': 0,
            'Forward': 0
        };
        starters.forEach(lineup => {
            const category = lineup.getPositionCategory();
            if (category in positionCounts) {
                positionCounts[category]++;
            }
        });
        // Format as traditional formation (e.g., "4-3-3")
        return `${positionCounts['Defender']}-${positionCounts['Midfielder']}-${positionCounts['Forward']}`;
    }
    // 🔧 Get lineup with player details
    async getDetailedLineup(fixtureId) {
        const lineups = await this.model.findAll({
            where: { fixtureId },
            include: [
                {
                    model: Player_1.Player,
                    as: 'player',
                    attributes: ['id', 'firstName', 'lastName', 'position', 'jerseyNumber', 'nationality', 'dateOfBirth']
                }
            ],
            order: [
                ['isStarter', 'DESC'],
                ['position', 'ASC'],
                ['jerseyNumber', 'ASC']
            ]
        });
        return lineups;
    }
}
exports.LineupRepository = LineupRepository;
//# sourceMappingURL=LineupRepository.js.map