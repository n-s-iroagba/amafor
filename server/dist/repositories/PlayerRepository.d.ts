import { Player, PlayerAttributes, PlayerCreationAttributes, PlayerPosition, PlayerStatus } from '@models/Player';
import { BaseRepository } from './BaseRepository';
export interface PlayerFilterOptions {
    position?: PlayerPosition;
    minAge?: number;
    maxAge?: number;
    status?: PlayerStatus;
    search?: string;
}
export interface PlayerSortOptions {
    sortBy?: 'name' | 'age' | 'position' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export declare class PlayerRepository extends BaseRepository<Player> {
    private auditLogRepository;
    constructor();
    createWithAudit(data: PlayerCreationAttributes, auditData: any): Promise<Player>;
    updateWithAudit(id: string, data: Partial<PlayerAttributes>, auditData: any): Promise<Player | null>;
    findWithFilters(filters: PlayerFilterOptions, sort?: PlayerSortOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: Player[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPlayerStats(id: string): Promise<{
        appearances: number;
        goals: number;
        assists: number;
        cleanSheets: number;
        yellowCards: number;
        redCards: number;
        minutesPlayed: number;
        averageRating?: number;
    }>;
    updatePlayerStats(id: string, stats: Partial<PlayerAttributes>): Promise<void>;
    getAuditTrail(id: string, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findSimilarPlayers(playerId: string, limit?: number): Promise<Player[]>;
    getDashboardStats(): Promise<{
        total: number;
        active: number;
        byPosition: Record<string, number>;
        averageAge: number;
    }>;
    exportToCSV(fields?: string[]): Promise<any[]>;
}
//# sourceMappingURL=PlayerRepository.d.ts.map