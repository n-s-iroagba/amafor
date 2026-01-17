import { Player, PlayerCreationAttributes } from '../models';
export declare class PlayerService {
    private playerRepository;
    private auditService;
    constructor();
    createPlayer(data: PlayerCreationAttributes, creatorId: string): Promise<Player>;
    getPlayerProfile(playerId: string, viewerId?: string): Promise<Player | null>;
    listPlayers(filters: any): Promise<Player[]>;
    updatePlayerStats(playerId: string, statsData: any, adminId: string): Promise<Player>;
    generateScoutReport(playerId: string, scoutId: string): Promise<any>;
}
//# sourceMappingURL=PlayerService.d.ts.map