"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineupService = void 0;
// services/LineupService.ts
const LineupRepository_1 = require("@repositories/LineupRepository");
const Fixture_1 = require("@models/Fixture");
const Player_1 = require("@models/Player");
const logger_1 = __importDefault(require("@utils/logger"));
class LineupService {
    constructor(repository) {
        this.repository = repository || new LineupRepository_1.LineupRepository();
    }
    async createLineup(data) {
        try {
            // Validate fixture exists and is upcoming/recent
            const fixture = await Fixture_1.Fixture.findByPk(data.fixtureId);
            if (!fixture) {
                throw new AppError('Fixture not found', 404);
            }
            // Validate player exists and is active
            const player = await Player_1.Player.findByPk(data.playerId);
            if (!player) {
                throw new AppError('Player not found', 404);
            }
            // Check if player is eligible (not suspended/injured)
            const playerStatus = player.status || 'ACTIVE';
            if (playerStatus !== 'ACTIVE') {
                throw new AppError(`Player is not eligible to play (status: ${playerStatus})`, 400);
            }
            // Check if player already in lineup
            const existingLineup = await this.repository.findOne({
                where: { fixtureId: data.fixtureId, playerId: data.playerId }
            });
            if (existingLineup) {
                throw new AppError('Player is already in the lineup for this fixture', 400);
            }
            // Validate position is valid for player's primary position
            const playerPrimaryPosition = player.primaryPosition;
            if (playerPrimaryPosition && !this.isValidPositionTransition(playerPrimaryPosition, data.position)) {
                logger_1.default.warn(`Player ${player.firstName} ${player.lastName} is playing out of position: ${data.position} (primary: ${playerPrimaryPosition})`);
            }
            const lineup = await this.repository.create(data);
            logger_1.default.info('Lineup entry created', {
                lineupId: lineup.id,
                fixtureId: data.fixtureId,
                playerId: data.playerId,
                position: data.position
            });
            return lineup.toJSON();
        }
        catch (error) {
            logger_1.default.error('Failed to create lineup entry', {
                error: error.message,
                data
            });
            throw error;
        }
    }
    async getLineupById(id) {
        const lineup = await this.repository.findById(id);
        if (!lineup) {
            throw new AppError('Lineup entry not found', 404);
        }
        return lineup.toJSON();
    }
    async getFixtureLineup(fixtureId) {
        const lineups = await this.repository.findByFixtureId(fixtureId);
        return lineups.map(l => l.toJSON());
    }
    async updateLineup(id, data) {
        try {
            const lineup = await this.repository.findById(id);
            if (!lineup) {
                throw new AppError('Lineup entry not found', 404);
            }
            // Prevent updating certain fields
            const restrictedFields = ['fixtureId', 'playerId', 'createdAt', 'updatedAt'];
            Object.keys(data).forEach(key => {
                if (restrictedFields.includes(key)) {
                    delete data[key];
                }
            });
            await this.repository.update(id, data);
            // Get updated lineup
            const updatedLineup = await this.repository.findById(id);
            if (!updatedLineup) {
                throw new AppError('Failed to retrieve updated lineup', 500);
            }
            logger_1.default.info('Lineup updated', { lineupId: id, updates: data });
            return updatedLineup.toJSON();
        }
        catch (error) {
            logger_1.default.error('Failed to update lineup', {
                error: error.message,
                lineupId: id,
                data
            });
            throw error;
        }
    }
    async deleteLineup(id) {
        const result = await this.repository.delete(id);
        if (result === 0) {
            throw new AppError('Lineup entry not found', 404);
        }
        logger_1.default.info('Lineup entry deleted', { lineupId: id });
    }
    async getDetailedFixtureLineup(fixtureId) {
        try {
            const [starters, substitutes, captain, formation] = await Promise.all([
                this.repository.findStarters(fixtureId),
                this.repository.findSubstitutes(fixtureId),
                this.repository.findCaptain(fixtureId),
                this.repository.getFormation(fixtureId)
            ]);
            return {
                starters: starters.map(s => s.toJSON()),
                substitutes: substitutes.map(s => s.toJSON()),
                captain: captain ? captain.toJSON() : null,
                formation
            };
        }
        catch (error) {
            logger_1.default.error('Failed to get detailed fixture lineup', {
                fixtureId,
                error: error.message
            });
            throw error;
        }
    }
    async setFixtureCaptain(fixtureId, playerId) {
        try {
            const fixture = await Fixture_1.Fixture.findByPk(fixtureId);
            if (!fixture) {
                throw new AppError('Fixture not found', 404);
            }
            const player = await Player_1.Player.findByPk(playerId);
            if (!player) {
                throw new AppError('Player not found', 404);
            }
            // Check if player is in lineup
            const playerLineup = await this.repository.findOne({
                where: { fixtureId, playerId }
            });
            if (!playerLineup) {
                throw new AppError('Player is not in the lineup for this fixture', 400);
            }
            const success = await this.repository.setCaptain(fixtureId, playerId);
            if (!success) {
                throw new AppError('Failed to set captain', 500);
            }
            // Get updated lineup entry
            const updatedLineup = await this.repository.findOne({
                where: { fixtureId, playerId }
            });
            if (!updatedLineup) {
                throw new AppError('Failed to retrieve updated lineup', 500);
            }
            logger_1.default.info('Captain set for fixture', {
                fixtureId,
                captainId: playerId,
                captainName: `${player.firstName} ${player.lastName}`
            });
            return updatedLineup.toJSON();
        }
        catch (error) {
            logger_1.default.error('Failed to set captain', {
                fixtureId,
                playerId,
                error: error.message
            });
            throw error;
        }
    }
    async getPlayerAppearanceStats(playerId) {
        try {
            const player = await Player_1.Player.findByPk(playerId);
            if (!player) {
                throw new AppError('Player not found', 404);
            }
            const appearances = await this.repository.getPlayerAppearances(playerId);
            const lineups = await this.repository.findByPlayerId(playerId);
            // Calculate favorite position
            const positionCounts = {};
            lineups.forEach(lineup => {
                const position = lineup.position;
                positionCounts[position] = (positionCounts[position] || 0) + 1;
            });
            const favoritePosition = Object.keys(positionCounts).reduce((a, b) => positionCounts[a] > positionCounts[b] ? a : b, 'Unknown');
            // Count captaincies
            const captaincies = lineups.filter(lineup => lineup.captain).length;
            return {
                playerId,
                playerName: `${player.firstName} ${player.lastName}`,
                totalAppearances: appearances.total,
                starts: appearances.starts,
                substituteAppearances: appearances.subs,
                captaincies,
                favoritePosition
            };
        }
        catch (error) {
            logger_1.default.error('Failed to get player appearance stats', {
                playerId,
                error: error.message
            });
            throw error;
        }
    }
    async bulkCreateFixtureLineup(fixtureId, lineups) {
        try {
            const fixture = await Fixture_1.Fixture.findByPk(fixtureId);
            if (!fixture) {
                throw new AppError('Fixture not found', 404);
            }
            // Validate all players exist
            const playerIds = lineups.map(l => l.playerId);
            const players = await Player_1.Player.findAll({
                where: { id: playerIds },
                attributes: ['id', 'firstName', 'lastName', 'status']
            });
            const validPlayerIds = players.map(p => p.id);
            const invalidPlayers = lineups.filter(l => !validPlayerIds.includes(l.playerId));
            if (invalidPlayers.length > 0) {
                throw new AppError(`Invalid player IDs: ${invalidPlayers.map(p => p.playerId).join(', ')}`, 400);
            }
            // Check for duplicate players in the provided lineup
            const playerIdCounts = {};
            lineups.forEach(lineup => {
                playerIdCounts[lineup.playerId] = (playerIdCounts[lineup.playerId] || 0) + 1;
            });
            const duplicatePlayers = Object.keys(playerIdCounts).filter(id => playerIdCounts[id] > 1);
            if (duplicatePlayers.length > 0) {
                throw new AppError(`Duplicate players in lineup: ${duplicatePlayers.join(', ')}`, 400);
            }
            const createdLineups = await this.repository.bulkCreateForFixture(fixtureId, lineups);
            logger_1.default.info('Bulk lineup created', {
                fixtureId,
                lineupCount: createdLineups.length
            });
            return createdLineups.map(l => l.toJSON());
        }
        catch (error) {
            logger_1.default.error('Failed to bulk create fixture lineup', {
                fixtureId,
                error: error.message,
                lineupCount: lineups.length
            });
            throw error;
        }
    }
    async replaceFixtureLineup(fixtureId, lineups) {
        try {
            const fixture = await Fixture_1.Fixture.findByPk(fixtureId);
            if (!fixture) {
                throw new AppError('Fixture not found', 404);
            }
            // Validate maximum squad size (typically 18-23 players)
            if (lineups.length > 23) {
                throw new AppError('Maximum squad size is 23 players', 400);
            }
            // Validate starting lineup size (typically 11 players)
            const starters = lineups.filter(l => l.isStarter);
            if (starters.length !== 11) {
                logger_1.default.warn(`Starting lineup has ${starters.length} players (expected 11)`);
            }
            const replacedLineups = await this.repository.replaceFixtureLineup(fixtureId, lineups);
            logger_1.default.info('Fixture lineup replaced', {
                fixtureId,
                oldLineupDeleted: true,
                newLineupCount: replacedLineups.length
            });
            return replacedLineups.map(l => l.toJSON());
        }
        catch (error) {
            logger_1.default.error('Failed to replace fixture lineup', {
                fixtureId,
                error: error.message
            });
            throw error;
        }
    }
    async getLineupAnalytics(fixtureId) {
        try {
            const fixture = await Fixture_1.Fixture.findByPk(fixtureId);
            if (!fixture) {
                throw new AppError('Fixture not found', 404);
            }
            const [stats, formation, captain] = await Promise.all([
                this.repository.getFixtureLineupStats(fixtureId),
                this.repository.getFormation(fixtureId),
                this.repository.findCaptain(fixtureId)
            ]);
            const captains = [];
            if (captain && captain.player) {
                captains.push({
                    playerId: captain.playerId,
                    playerName: `${captain.player.firstName} ${captain.player.lastName}`
                });
            }
            return {
                fixtureId,
                formation,
                starters: stats.starters,
                substitutes: stats.substitutes,
                captains
            };
        }
        catch (error) {
            logger_1.default.error('Failed to get lineup analytics', {
                fixtureId,
                error: error.message
            });
            throw error;
        }
    }
    async searchLineups(query) {
        const lineups = await this.repository.searchLineupsByPlayerName(query);
        return lineups.map(l => l.toJSON());
    }
    // Private helper methods
    isValidPositionTransition(primary, newPosition) {
        // Define valid position transitions
        const positionGroups = {
            'Goalkeeper': ['GK'],
            'Defender': ['RB', 'CB', 'LB', 'RWB', 'LWB'],
            'Midfielder': ['CDM', 'CM', 'CAM', 'RM', 'LM'],
            'Forward': ['RW', 'LW', 'CF', 'ST']
        };
        const primaryGroup = Object.keys(positionGroups).find(group => positionGroups[group].includes(primary));
        const newGroup = Object.keys(positionGroups).find(group => positionGroups[group].includes(newPosition));
        return primaryGroup === newGroup;
    }
}
exports.LineupService = LineupService;
// Helper class for application errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
//# sourceMappingURL=LineupService.js.map