
import logger from '../../utils/logger';
import { developmentLineups } from '../data/development/lineup';
import { productionLineups } from '../data/production/lineups';
import { testLineups } from '../data/testing/lineups';
import Lineup, { LineupAttributes } from '../../models/Lineup';
import { BaseSeeder } from './base-seeder';

export class LineupSeeder extends BaseSeeder<Lineup> {
  constructor() {
    super(Lineup, 'lineup');
  }

  async getData(environment: string): Promise<LineupAttributes[]> {
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

  private async getProductionData(): Promise<LineupAttributes[]> {
    try {
      return productionLineups || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): LineupAttributes[] {
    try {
      return testLineups || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): LineupAttributes[] {
    try {
      return developmentLineups || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
