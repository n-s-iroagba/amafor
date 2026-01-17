import { LeagueStatisticsAttributes, LeagueStatisticsCreationAttributes } from '../models/LeagueStatistics';
import { ILeagueStatisticsRepository } from '../repositories/leagueStatistics.repository';
export interface CreateLeagueStatisticsData extends Omit<LeagueStatisticsCreationAttributes, 'id'> {
    leagueId: string;
    team: string;
    goalsFor?: number;
    goalsAgainst?: number;
}
export interface UpdateLeagueStatisticsData extends Partial<Omit<LeagueStatisticsAttributes, 'id' | 'leagueId'>> {
}
export declare class LeagueStatisticsService {
    private repository;
    constructor(repository?: ILeagueStatisticsRepository);
    createStatistics(data: CreateLeagueStatisticsData): Promise<LeagueStatisticsAttributes>;
    getStatisticsById(id: string): Promise<LeagueStatisticsAttributes>;
    getAllStatistics(leagueId: string, options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
        includeLeague?: boolean;
    }): Promise<{
        statistics: LeagueStatisticsAttributes[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getLeagueStandings(leagueId: string): Promise<LeagueStatisticsAttributes[]>;
    updateStatistics(id: string, data: UpdateLeagueStatisticsData): Promise<LeagueStatisticsAttributes>;
    deleteStatistics(id: string): Promise<void>;
    updateMatchResult(leagueId: string, homeTeam: string, awayTeam: string, homeGoals: number, awayGoals: number): Promise<void>;
    getTeamStatistics(leagueId: string, team: string): Promise<LeagueStatisticsAttributes>;
    getTopScorers(leagueId: string, limit?: number): Promise<LeagueStatisticsAttributes[]>;
    getTopDefenses(leagueId: string, limit?: number): Promise<LeagueStatisticsAttributes[]>;
    getFormTable(leagueId: string): Promise<LeagueStatisticsAttributes[]>;
    getHomeAwayStats(leagueId: string): Promise<any>;
    getLeagueSummary(leagueId: string): Promise<{
        totalGoals: number;
        averageGoalsPerMatch: number;
        totalMatches: number;
        totalTeams: number;
        highestScoringTeam: string;
        bestDefenseTeam: string;
        mostCleanSheets: string;
    }>;
    private calculateMatchUpdate;
    private applyMatchUpdate;
}
//# sourceMappingURL=LeagueStatisticsService.d.ts.map