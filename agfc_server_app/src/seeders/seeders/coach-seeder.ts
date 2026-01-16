
import logger from '@utils/logger';
import { developmentCoaches } from '../data/development/coachs';
import { productionCoachs } from '../data/production/coachs';
import { testCoachs } from '../data/testing/coachs';
import Coach, { CoachAttributes } from '@models/Coach';
import { BaseSeeder } from './base-seeder';

export class CoachSeeder extends BaseSeeder<Coach> {
  constructor() {
    super(Coach, 'coach');
  }

  async getData(environment: string): Promise<CoachAttributes[]> {
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

  private async getProductionData(): Promise<CoachAttributes[]> {
    try {
      return productionCoachs || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): CoachAttributes[] {
    try {
      return testCoachs || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): CoachAttributes[] {
    try {
      return developmentCoaches || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
