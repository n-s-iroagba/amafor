import { BaseRepository } from './BaseRepository';
import { Lineup, LineupAttributes, LineupCreationAttributes } from '@models/Lineup';
import { Player } from '@models/Player';
export interface ILineupRepository {
    findById(id: string): Promise<Lineup | null>;
    findAll(options?: any): Promise<Lineup[]>;
    findOne(options?: any): Promise<Lineup | null>;
    create(data: LineupCreationAttributes): Promise<Lineup>;
    update(id: string, data: Partial<LineupAttributes>): Promise<[number, Lineup[]]>;
    delete(id: string): Promise<number>;
    count(options?: any): Promise<number>;
    paginate(page: number, limit: number, options?: any): Promise<any>;
    exists(id: string): Promise<boolean>;
    findByFixtureId(fixtureId: string): Promise<Lineup[]>;
    findByPlayerId(playerId: string): Promise<Lineup[]>;
    findByPosition(position: string): Promise<Lineup[]>;
    findStarters(fixtureId: string): Promise<Lineup[]>;
    findSubstitutes(fixtureId: string): Promise<Lineup[]>;
    findCaptain(fixtureId: string): Promise<Lineup | null>;
    getPlayerAppearances(playerId: string): Promise<{
        starts: number;
        subs: number;
        total: number;
    }>;
    getFixtureLineupStats(fixtureId: string): Promise<{
        totalPlayers: number;
        starters: number;
        substitutes: number;
        byPosition: Record<string, number>;
    }>;
    updatePlayerPosition(fixtureId: string, playerId: string, position: string): Promise<boolean>;
    toggleStarterStatus(id: string): Promise<boolean>;
    setCaptain(fixtureId: string, playerId: string): Promise<boolean>;
    bulkCreateForFixture(fixtureId: string, lineups: LineupCreationAttributes[]): Promise<Lineup[]>;
    replaceFixtureLineup(fixtureId: string, lineups: LineupCreationAttributes[]): Promise<Lineup[]>;
    deleteByFixtureId(fixtureId: string): Promise<number>;
    searchLineupsByPlayerName(query: string): Promise<Lineup[]>;
    getLineupsByTeam(fixtureId: string, team?: 'home' | 'away'): Promise<Lineup[]>;
    getFormation(fixtureId: string): Promise<string>;
}
export declare class LineupRepository extends BaseRepository<Lineup> implements ILineupRepository {
    constructor();
    findByFixtureId(fixtureId: string): Promise<Lineup[]>;
    findByPlayerId(playerId: string): Promise<Lineup[]>;
    findByPosition(position: string): Promise<Lineup[]>;
    findStarters(fixtureId: string): Promise<Lineup[]>;
    findSubstitutes(fixtureId: string): Promise<Lineup[]>;
    findCaptain(fixtureId: string): Promise<Lineup | null>;
    getPlayerAppearances(playerId: string): Promise<{
        starts: number;
        subs: number;
        total: number;
    }>;
    getFixtureLineupStats(fixtureId: string): Promise<{
        totalPlayers: number;
        starters: number;
        substitutes: number;
        byPosition: Record<string, number>;
    }>;
    updatePlayerPosition(fixtureId: string, playerId: string, position: string): Promise<boolean>;
    toggleStarterStatus(id: string): Promise<boolean>;
    setCaptain(fixtureId: string, playerId: string): Promise<boolean>;
    bulkCreateForFixture(fixtureId: string, lineups: LineupCreationAttributes[]): Promise<Lineup[]>;
    replaceFixtureLineup(fixtureId: string, lineups: LineupCreationAttributes[]): Promise<Lineup[]>;
    deleteByFixtureId(fixtureId: string): Promise<number>;
    searchLineupsByPlayerName(query: string): Promise<Lineup[]>;
    getLineupsByTeam(fixtureId: string, team?: 'home' | 'away'): Promise<Lineup[]>;
    create(data: LineupCreationAttributes): Promise<Lineup>;
    update(id: string, data: Partial<LineupAttributes>): Promise<[number, Lineup[]]>;
    getFormation(fixtureId: string): Promise<string>;
    getDetailedLineup(fixtureId: string): Promise<Array<Lineup & {
        player: Player;
    }>>;
}
//# sourceMappingURL=LineupRepository.d.ts.map