import League, { LeagueAttributes } from '@models/League';
import { BaseSeeder } from './base-seeder';
export declare class LeagueSeeder extends BaseSeeder<League> {
    constructor();
    getData(environment: string): Promise<LeagueAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=league-seeder.d.ts.map