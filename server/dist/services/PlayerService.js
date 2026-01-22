"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const PlayerRepository_1 = require("../repositories/PlayerRepository");
const AuditService_1 = require("./AuditService");
const logger_1 = __importDefault(require("../utils/logger"));
class PlayerService {
    constructor() {
        this.playerRepository = new PlayerRepository_1.PlayerRepository();
        this.auditService = new AuditService_1.AuditService();
    }
    async createPlayer(data, creatorId) {
        try {
            const player = await this.playerRepository.create(data);
            await this.auditService.logAction({
                userId: creatorId,
                userEmail: 'system',
                userType: 'admin',
                action: 'CREATE',
                entityType: 'PLAYER',
                entityId: player.id,
                entityName: player.name,
                changes: [],
                ipAddress: '0.0.0.0',
                metadata: { position: player.position }
            });
            logger_1.default.info('Player created', { playerId: player.id, position: player.position });
            return player;
        }
        catch (error) {
            logger_1.default.error('Failed to create player', { error: error.message });
            throw error;
        }
    }
    async getPlayerProfile(playerId, viewerId) {
        try {
            const player = await this.playerRepository.findById(playerId);
            if (player && viewerId) {
                logger_1.default.info('Player viewed', { playerId, playerName: player.name });
            }
            return player;
        }
        catch (error) {
            logger_1.default.error('Failed to get player profile', { error: error.message });
            throw error;
        }
    }
    async listPlayers(filters) {
        try {
            return await this.playerRepository.findAll(filters);
        }
        catch (error) {
            logger_1.default.error('Failed to list players', { error: error.message });
            throw error;
        }
    }
    async updatePlayerStats(playerId, statsData, adminId) {
        try {
            const [affected, updatedPlayers] = await this.playerRepository.update(playerId, statsData);
            if (!affected)
                throw new Error('Player not found');
            await this.auditService.logAction({
                userId: adminId,
                userEmail: 'admin',
                userType: 'admin',
                action: 'UPDATE',
                entityType: 'PLAYER',
                entityId: playerId,
                entityName: 'Stats Update',
                changes: Object.keys(statsData).map(k => ({ field: k, newValue: statsData[k] })),
                ipAddress: '0.0.0.0',
                metadata: { type: 'performance_update' }
            });
            return updatedPlayers[0];
        }
        catch (error) {
            logger_1.default.error('Failed to update player stats', { error: error.message });
            throw error;
        }
    }
    async generateScoutReport(playerId, scoutId) {
        try {
            const player = await this.playerRepository.findById(playerId);
            if (!player)
                throw new Error('Player not found');
            const report = {
                generatedAt: new Date(),
                scoutId,
                player: {
                    name: player.name,
                    position: player.position,
                    metadata: player.metadata || {}
                }
            };
            logger_1.default.info('Scout report generated', { playerId, scoutId });
            return report;
        }
        catch (error) {
            logger_1.default.error('Failed to generate scout report', { error: error.message });
            throw error;
        }
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=PlayerService.js.map