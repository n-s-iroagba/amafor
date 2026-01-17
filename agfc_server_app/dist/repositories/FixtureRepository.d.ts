import { Fixture, FixtureAttributes, FixtureCreationAttributes, FixtureStatus, ArchiveStatus } from '@models/Fixture';
import { BaseRepository } from './BaseRepository';
export interface FixtureFilterOptions {
    status?: FixtureStatus;
    dateFrom?: Date;
    dateTo?: Date;
    competition?: string;
    search?: string;
}
export declare class FixtureRepository extends BaseRepository<Fixture> {
    private auditLogRepository;
    constructor();
    createWithAudit(data: FixtureCreationAttributes, auditData: any): Promise<Fixture>;
    updateWithAudit(id: string, data: Partial<FixtureAttributes>, auditData: any): Promise<Fixture | null>;
    findWithFilters(filters: FixtureFilterOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: Fixture[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findUpcoming(limit?: number): Promise<Fixture[]>;
    findRecentResults(limit?: number): Promise<Fixture[]>;
    updateLineup(id: string, lineupData: any, isHome: boolean, auditData: any): Promise<Fixture | null>;
    updateScore(id: string, homeScore: number, awayScore: number, auditData: any): Promise<Fixture | null>;
    updateArchiveStatus(id: string, archiveStatus: ArchiveStatus, auditData: any, availableAt?: Date): Promise<Fixture | null>;
    findMatchArchives(filters?: FixtureFilterOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: Fixture[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getLeagueTable(season?: string, competition?: string): Promise<any>;
    private calculateLeagueTable;
    private initializeTeamStats;
    getDashboardStats(): Promise<{
        total: number;
        upcoming: number;
        completed: number;
        byStatus: Record<string, number>;
        byCompetition: Record<string, number>;
    }>;
    processArchives(): Promise<void>;
}
//# sourceMappingURL=FixtureRepository.d.ts.map