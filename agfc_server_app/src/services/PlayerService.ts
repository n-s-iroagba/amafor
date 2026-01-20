import { PlayerRepository } from '../repositories/PlayerRepository';
import { AuditService } from './AuditService';
import Player, { PlayerCreationAttributes } from '../models/Player';
import logger from '../utils/logger';

export class PlayerService {
  private playerRepository: PlayerRepository;
  private auditService: AuditService;

  constructor() {
    this.playerRepository = new PlayerRepository();
    this.auditService = new AuditService();
  }

  public async createPlayer(data: PlayerCreationAttributes, creatorId: string): Promise<Player> {
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

      logger.info('Player created', { playerId: player.id, position: player.position });
      return player;
    } catch (error: any) {
      logger.error('Failed to create player', { error: error.message });
      throw error;
    }
  }

  public async getPlayerProfile(playerId: string, viewerId?: string): Promise<Player | null> {
    try {
      const player = await this.playerRepository.findById(playerId);

      if (player && viewerId) {
        logger.info('Player viewed', { playerId, playerName: player.name });
      }

      return player;
    } catch (error: any) {
      logger.error('Failed to get player profile', { error: error.message });
      throw error;
    }
  }

  public async listPlayers(filters: any): Promise<Player[]> {
    try {
      return await this.playerRepository.findAll(filters);
    } catch (error: any) {
      logger.error('Failed to list players', { error: error.message });
      throw error;
    }
  }

  public async updatePlayerStats(playerId: string, statsData: any, adminId: string): Promise<Player> {
    try {
      const [affected, updatedPlayers] = await this.playerRepository.update(playerId, statsData);

      if (!affected) throw new Error('Player not found');

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
    } catch (error: any) {
      logger.error('Failed to update player stats', { error: error.message });
      throw error;
    }
  }

  public async generateScoutReport(playerId: string, scoutId: string): Promise<any> {
    try {
      const player = await this.playerRepository.findById(playerId);
      if (!player) throw new Error('Player not found');

      const report = {
        generatedAt: new Date(),
        scoutId,
        player: {
          name: player.name,
          position: player.position,
          metadata: player.metadata || {}
        }
      };

      logger.info('Scout report generated', { playerId, scoutId });

      return report;
    } catch (error: any) {
      logger.error('Failed to generate scout report', { error: error.message });
      throw error;
    }
  }
}