
import { LeagueStatistics } from '@models/LeagueStatistics';
import { LeagueStatisticsAttributes } from '@models/LeagueStatistics';
import logger from '../../utils/logger';
import { developmentLeagueStatistics } from '../data/development/leaguestatistics';
import { productionLeagueStatisticss } from '../data/production/leaguestatisticss';
import { testLeagueStatisticss } from '../data/testing/leaguestatisticss';
import { BaseSeeder } from './base-seeder';

export class LeagueStatisticsSeeder extends BaseSeeder<LeagueStatistics> {
  constructor() {
    super(LeagueStatistics, 'leaguestatistics');
  }

  async getData(environment: string): Promise<LeagueStatisticsAttributes[]> {
    logger.info(`Loading ${this.name} data for ${environment} environment`);
    
    switch (environment) {
      case 'production':
        return await this.getProductionData();
      case 'test':
        return this.getTestData();
      case 'development':
      default:
        return this.getDevelopmentData();
    }
  }

  private async getProductionData(): Promise<LeagueStatisticsAttributes[]> {
    try {
      return productionLeagueStatisticss || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): LeagueStatisticsAttributes[] {
    try {
      return testLeagueStatisticss || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): LeagueStatisticsAttributes[] {
    try {
      return developmentLeagueStatistics || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
