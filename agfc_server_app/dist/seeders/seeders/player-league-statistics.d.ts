import PlayerLeagueStatistics, { PlayerLeagueStatisticsAttributes } from "@models/PlayerLeagueStatistics";
import { BaseSeeder } from "./base-seeder";
export declare class PlayerLeagueStatisticsSeeder extends BaseSeeder<PlayerLeagueStatistics> {
    constructor();
    getData(environment: string): Promise<PlayerLeagueStatisticsAttributes[]>;
    private getDevelopmentData;
}
//# sourceMappingURL=player-league-statistics.d.ts.map