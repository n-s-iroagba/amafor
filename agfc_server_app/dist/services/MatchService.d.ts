import { Fixture, FixtureCreationAttributes } from '../models';
export declare class MatchService {
    private fixtureRepository;
    constructor();
    createFixture(data: FixtureCreationAttributes, creatorId?: string): Promise<Fixture>;
    getUpcoming(limit?: number): Promise<Fixture[]>;
    recordResult(fixtureId: string, resultData: any, updaterId: string): Promise<Fixture>;
    calculateLeagueTable(season: string): Promise<any[]>;
    findAll(filters: any): Promise<Fixture[]>;
}
//# sourceMappingURL=MatchService.d.ts.map