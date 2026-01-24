import { LeagueStatisticsAttributes } from '../models/LeagueStatistics';
import { LeagueStatisticsRepository } from '@repositories/LeagueStatisticsRepository';
import { PaginatedData } from 'src/types';
export interface CreateLeagueStatisticsData {
    leagueId: string;
    team: string;
    goalsFor?: number;
    goalsAgainst?: number;
}
export interface UpdateLeagueStatisticsData extends Partial<Omit<LeagueStatisticsAttributes, 'id' | 'leagueId'>> {
}
export declare class LeagueStatisticsService {
    private repository;
    constructor(repository?: LeagueStatisticsRepository);
    createStatistics(data: CreateLeagueStatisticsData): Promise<LeagueStatisticsAttributes>;
    getStatisticsById(id: string): Promise<LeagueStatisticsAttributes>;
    getAllStatistics(leagueId: string, options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
        includeLeague?: boolean;
    }): Promise<PaginatedData<LeagueStatisticsAttributes>>;
    getLeagueStandings(leagueId: string): Promise<LeagueStatisticsAttributes[]>;
    updateStatistics(id: string, data: UpdateLeagueStatisticsData): Promise<LeagueStatisticsAttributes>;
    deleteStatistics(id: string): Promise<void>;
    updateFixtureResult(leagueId: string, homeTeam: string, awayTeam: string, homeGoals: number, awayGoals: number): Promise<void>;
    getTeamStatistics(leagueId: string, team: string): Promise<LeagueStatisticsAttributes>;
    getTopScorers(leagueId: string, limit?: number): Promise<LeagueStatisticsAttributes[]>;
    getTopDefenses(leagueId: string, limit?: number): Promise<LeagueStatisticsAttributes[]>;
    getFormTable(leagueId: string): Promise<LeagueStatisticsAttributes[]>;
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
    private calculateFixtureUpdate;
    private applyFixtureUpdate;
}
//# sourceMappingURL=LeagueStatisticsService.d.ts.map