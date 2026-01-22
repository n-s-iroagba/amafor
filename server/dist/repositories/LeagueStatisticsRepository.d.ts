import { LeagueStatistics, LeagueStatisticsAttributes, LeagueStatisticsCreationAttributes } from '../models/LeagueStatistics';
import { BaseRepository } from './BaseRepository';
export declare class LeagueStatisticsRepository extends BaseRepository<LeagueStatistics> {
    constructor();
    createBulk(data: LeagueStatisticsCreationAttributes[]): Promise<LeagueStatistics[]>;
    findAllByLeague(leagueId: string, options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
        includeLeague?: boolean;
    }): Promise<{
        rows: LeagueStatistics[];
        count: number;
    }>;
    findByTeam(leagueId: string, team: string): Promise<LeagueStatistics | null>;
    deleteByLeague(leagueId: string): Promise<number>;
    getLeagueStandings(leagueId: string): Promise<LeagueStatistics[]>;
    getTeamStatistics(leagueId: string, team: string): Promise<LeagueStatistics | null>;
    updateTeamStats(leagueId: string, team: string, data: Partial<LeagueStatisticsAttributes>): Promise<[number, LeagueStatistics[]]>;
    recalculateStandings(leagueId: string): Promise<void>;
    getTopScorers(leagueId: string, limit?: number): Promise<LeagueStatistics[]>;
    getTopDefenses(leagueId: string, limit?: number): Promise<LeagueStatistics[]>;
    getFormTable(leagueId: string): Promise<LeagueStatistics[]>;
    getHomeAwayStats(leagueId: string): Promise<any>;
    getLeagueSummary(leagueId: string): Promise<{
        totalGoals: number;
        averageGoalsPerFixture: number;
        totalFixturees: number;
        totalTeams: number;
        highestScoringTeam: string;
        bestDefenseTeam: string;
        mostCleanSheets: string;
    }>;
}
//# sourceMappingURL=LeagueStatisticsRepository.d.ts.map