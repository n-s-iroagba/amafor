import { PlayerRepository } from '../repositories';
import { AuditService } from './AuditService';
import { Player, PlayerCreationAttributes } from '../models';
import { structuredLogger, tracer } from '../utils';

export class PlayerService {
  private playerRepository: PlayerRepository;
  private auditService: AuditService;

  constructor() {
    this.playerRepository = new PlayerRepository();
    this.auditService = new AuditService();
  }

  public async createPlayer(data: PlayerCreationAttributes, creatorId: string): Promise<Player> {
    return tracer.startActiveSpan('service.PlayerService.createPlayer', async (span) => {
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

        structuredLogger.business('PLAYER_CREATED', 0, creatorId, { playerId: player.id, position: player.position });
        return player;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async getPlayerProfile(playerId: string, viewerId?: string): Promise<Player | null> {
    return tracer.startActiveSpan('service.PlayerService.getPlayerProfile', async (span) => {
      try {
        const player = await this.playerRepository.findById(playerId);
        
        if (player && viewerId) {
          structuredLogger.business('PLAYER_VIEWED', 0, viewerId, { playerId, playername: player.lastName });
        }
        
        return player;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async listPlayers(filters: any): Promise<Player[]> {
    return tracer.startActiveSpan('service.PlayerService.listPlayers', async (span) => {
      try {
        return await this.playerRepository.findAll(filters);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async updatePlayerStats(playerId: string, statsData: any, adminId: string): Promise<Player> {
    return tracer.startActiveSpan('service.PlayerService.updatePlayerStats', async (span) => {
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
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async generateScoutReport(playerId: string, scoutId: string): Promise<any> {
    return tracer.startActiveSpan('service.PlayerService.generateScoutReport', async (span) => {
      try {
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new Error('Player not found');

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

        structuredLogger.business('SCOUT_REPORT_GENERATED', 0, scoutId, { playerId });
        
        return report;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}