import { ILineupRepository } from '@repositories/LineupRepository';
import { LineupAttributes, LineupCreationAttributes } from '@models/Lineup';
export interface CreateLineupData extends Omit<LineupCreationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
    fixtureId: string;
    playerId: string;
    jerseyNumber?: number;
}
export interface UpdateLineupData extends Partial<Omit<LineupAttributes, 'id' | 'createdAt' | 'updatedAt'>> {
}
export interface LineupAnalytics {
    fixtureId: string;
    formation: string;
    starters: number;
    substitutes: number;
    averageAge?: number;
    captains: Array<{
        playerId: string;
        playerName: string;
    }>;
}
export interface PlayerAppearanceStats {
    playerId: string;
    playerName: string;
    totalAppearances: number;
    starts: number;
    substituteAppearances: number;
    captaincies: number;
    favoritePosition: string;
}
export declare class LineupService {
    private repository;
    constructor(repository?: ILineupRepository);
    createLineup(data: CreateLineupData): Promise<LineupAttributes>;
    getLineupById(id: string): Promise<LineupAttributes>;
    getFixtureLineup(fixtureId: string): Promise<LineupAttributes[]>;
    updateLineup(id: string, data: UpdateLineupData): Promise<LineupAttributes>;
    deleteLineup(id: string): Promise<void>;
    getDetailedFixtureLineup(fixtureId: string): Promise<{
        starters: LineupAttributes[];
        substitutes: LineupAttributes[];
        captain: LineupAttributes | null;
        formation: string;
    }>;
    setFixtureCaptain(fixtureId: string, playerId: string): Promise<LineupAttributes>;
    getPlayerAppearanceStats(playerId: string): Promise<PlayerAppearanceStats>;
    bulkCreateFixtureLineup(fixtureId: string, lineups: CreateLineupData[]): Promise<LineupAttributes[]>;
    replaceFixtureLineup(fixtureId: string, lineups: CreateLineupData[]): Promise<LineupAttributes[]>;
    getLineupAnalytics(fixtureId: string): Promise<LineupAnalytics>;
    searchLineups(query: string): Promise<LineupAttributes[]>;
    private isValidPositionTransition;
}
//# sourceMappingURL=LineupService.d.ts.map