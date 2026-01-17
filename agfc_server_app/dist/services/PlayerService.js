"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const repositories_1 = require("../repositories");
const AuditService_1 = require("./AuditService");
const utils_1 = require("../utils");
class PlayerService {
    constructor() {
        this.playerRepository = new repositories_1.PlayerRepository();
        this.auditService = new AuditService_1.AuditService();
    }
    async createPlayer(data, creatorId) {
        return utils_1.tracer.startActiveSpan('service.PlayerService.createPlayer', async (span) => {
            try {
                const player = await this.playerRepository.create(data);
                await this.auditService.logAction({
                    userId: creatorId,
                    userEmail: 'system',
                    userType: 'admin',
                    action: 'CREATE',
                    entityType: 'PLAYER',
                    entityId: player.id,
                    entityName: `${player.firstName} ${player.lastName}`,
                    changes: [],
                    ipAddress: '0.0.0.0',
                    metadata: { position: player.position }
                });
                utils_1.structuredLogger.business('PLAYER_CREATED', 0, creatorId, { playerId: player.id, position: player.position });
                return player;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getPlayerProfile(playerId, viewerId) {
        return utils_1.tracer.startActiveSpan('service.PlayerService.getPlayerProfile', async (span) => {
            try {
                const player = await this.playerRepository.findById(playerId);
                if (player && viewerId) {
                    utils_1.structuredLogger.business('PLAYER_VIEWED', 0, viewerId, { playerId, playername: player.lastName });
                }
                return player;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async listPlayers(filters) {
        return utils_1.tracer.startActiveSpan('service.PlayerService.listPlayers', async (span) => {
            try {
                return await this.playerRepository.findAll(filters);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updatePlayerStats(playerId, statsData, adminId) {
        return utils_1.tracer.startActiveSpan('service.PlayerService.updatePlayerStats', async (span) => {
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
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async generateScoutReport(playerId, scoutId) {
        return utils_1.tracer.startActiveSpan('service.PlayerService.generateScoutReport', async (span) => {
            try {
                const player = await this.playerRepository.findById(playerId);
                if (!player)
                    throw new Error('Player not found');
                const report = {
                    generatedAt: new Date(),
                    scoutId,
                    player: {
                        name: `${player.firstName} ${player.lastName}`,
                        position: player.position,
                        stats: player.stats || {},
                        physical: player.physicalAttributes || {}
                    }
                };
                utils_1.structuredLogger.business('SCOUT_REPORT_GENERATED', 0, scoutId, { playerId });
                return report;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=PlayerService.js.map