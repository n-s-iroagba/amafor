import { LeagueStatistics } from '@models/LeagueStatistics';
import { LeagueStatisticsAttributes } from '@models/LeagueStatistics';
import { BaseSeeder } from './base-seeder';
export declare class LeagueStatisticsSeeder extends BaseSeeder<LeagueStatistics> {
    constructor();
    getData(environment: string): Promise<LeagueStatisticsAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=leaguestatistics-seeder.d.ts.map