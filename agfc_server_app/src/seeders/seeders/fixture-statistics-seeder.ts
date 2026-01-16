// seeders/FixtureStatisticsSeeder.ts
import FixtureStatistics, { FixtureStatisticsAttributes } from "../../models/FixtureStatistics";
import logger from "../../utils/logger";
import { developmentFixtureStatistics } from "../data/development/fixtureStatistics";
import { BaseSeeder } from "./base-seeder";

export class FixtureStatisticsSeeder extends BaseSeeder<FixtureStatistics> {
  constructor() {
    super(FixtureStatistics, 'fixture_statistics');
  }

  async getData(environment: string): Promise<FixtureStatisticsAttributes[]> {
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

  private getDevelopmentData(): FixtureStatisticsAttributes[] {
    try {
      return developmentFixtureStatistics || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }
}