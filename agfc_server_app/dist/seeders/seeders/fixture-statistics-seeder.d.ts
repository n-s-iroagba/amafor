import FixtureStatistics, { FixtureStatisticsAttributes } from "@models/FixtureStatistics";
import { BaseSeeder } from "./base-seeder";
export declare class FixtureStatisticsSeeder extends BaseSeeder<FixtureStatistics> {
    constructor();
    getData(environment: string): Promise<FixtureStatisticsAttributes[]>;
    private getDevelopmentData;
}
//# sourceMappingURL=fixture-statistics-seeder.d.ts.map