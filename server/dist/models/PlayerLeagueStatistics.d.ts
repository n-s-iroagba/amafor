import { Model, Optional } from 'sequelize';
export interface PlayerLeagueStatisticsAttributes {
    id: string;
    playerId: string;
    leagueId: string;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
    createdById: string;
    updatedById: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface PlayerLeagueStatisticsCreationAttributes extends Optional<PlayerLeagueStatisticsAttributes, 'id' | 'createdAt' | 'updatedAt' | 'assists' | 'cleanSheets' | 'yellowCards' | 'redCards' | 'minutesPlayed'> {
}
export declare class PlayerLeagueStatistics extends Model<PlayerLeagueStatisticsAttributes, PlayerLeagueStatisticsCreationAttributes> implements PlayerLeagueStatisticsAttributes {
    id: string;
    playerId: string;
    leagueId: string;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
    createdById: string;
    updatedById: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default PlayerLeagueStatistics;
//# sourceMappingURL=PlayerLeagueStatistics.d.ts.map