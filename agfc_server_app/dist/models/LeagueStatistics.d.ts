import { Model, Optional } from 'sequelize';
export interface LeagueStatisticsAttributes {
    id: string;
    leagueId: string;
    team: string;
    goalsFor: number;
    goalsAgainst: number;
    fixtureId?: number;
    matchesPlayed?: number;
    wins?: number;
    draws?: number;
    losses?: number;
    points?: number;
    goalDifference?: number;
    homeGoalsFor?: number;
    homeGoalsAgainst?: number;
    awayGoalsFor?: number;
    awayGoalsAgainst?: number;
    form?: string;
    cleanSheets?: number;
    failedToScore?: number;
    avgGoalsPerMatch?: number;
    avgGoalsConcededPerMatch?: number;
    lastMatchDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface LeagueStatisticsCreationAttributes extends Optional<LeagueStatisticsAttributes, 'id' | 'matchesPlayed' | 'wins' | 'draws' | 'losses' | 'points' | 'goalDifference' | 'homeGoalsFor' | 'homeGoalsAgainst' | 'awayGoalsFor' | 'awayGoalsAgainst' | 'form' | 'cleanSheets' | 'failedToScore' | 'avgGoalsPerMatch' | 'avgGoalsConcededPerMatch' | 'lastMatchDate'> {
}
export declare class LeagueStatistics extends Model<LeagueStatisticsAttributes, LeagueStatisticsCreationAttributes> implements LeagueStatisticsAttributes {
    id: string;
    leagueId: string;
    team: string;
    goalsFor: number;
    goalsAgainst: number;
    fixtureId?: number;
    matchesPlayed?: number;
    wins?: number;
    draws?: number;
    losses?: number;
    points?: number;
    goalDifference?: number;
    homeGoalsFor?: number;
    homeGoalsAgainst?: number;
    awayGoalsFor?: number;
    awayGoalsAgainst?: number;
    form?: string;
    cleanSheets?: number;
    failedToScore?: number;
    avgGoalsPerMatch?: number;
    avgGoalsConcededPerMatch?: number;
    lastMatchDate?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default LeagueStatistics;
//# sourceMappingURL=LeagueStatistics.d.ts.map