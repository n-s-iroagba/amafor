// seeders/PlayerLeagueStatisticsSeeder.ts
import PlayerLeagueStatistics, { PlayerLeagueStatisticsAttributes } from "../../models/PlayerLeagueStatistics";
import logger from "../../utils/logger";
import { developmentPlayerLeagueStatistics } from "../data/development/playerLeagueStatistics";
import { BaseSeeder } from "./base-seeder";

export class PlayerLeagueStatisticsSeeder extends BaseSeeder<PlayerLeagueStatistics> {
  constructor() {
    super(PlayerLeagueStatistics, 'player_league_statistics');
  }

  async getData(environment: string): Promise<PlayerLeagueStatisticsAttributes[]> {
    logger.info(`Loading ${this.name} data for ${environment} environment`);

    switch (environment) {
      case 'production':
        return [];
      case 'test':
        return [];
      case 'development':
      default:
        return this.getDevelopmentData();
    }
  }

  private getDevelopmentData(): PlayerLeagueStatisticsAttributes[] {
    try {
      return developmentPlayerLeagueStatistics || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }
}