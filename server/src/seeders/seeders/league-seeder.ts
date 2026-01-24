
import logger from '../../utils/logger';
import { developmentLeagues } from '../data/development/leagues';
import { productionLeagues } from '../data/production/leagues';
import { testLeagues } from '../data/testing/leagues';
import League, { LeagueAttributes } from '../../models/League';
import { BaseSeeder } from './base-seeder';

export class LeagueSeeder extends BaseSeeder<League> {
  constructor() {
    super(League, 'league');
  }

  async getData(environment: string): Promise<LeagueAttributes[]> {
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

  private async getProductionData(): Promise<LeagueAttributes[]> {
    try {
      return productionLeagues || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): LeagueAttributes[] {
    try {
      return testLeagues || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): LeagueAttributes[] {
    try {
      return developmentLeagues || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
