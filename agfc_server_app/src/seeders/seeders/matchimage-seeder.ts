;
import logger from '../../utils/logger';
import { developmentMatchImages } from '../data/development/matchimages';
import { productionMatchImages } from '../data/production/matchimages';
import { testMatchImages } from '../data/testing/matchimages';
import MatchImage, { MatchImageAttributes } from '@models/MatchImage';
import { BaseSeeder } from './base-seeder';

export class MatchImageSeeder extends BaseSeeder<MatchImage> {
  constructor() {
    super(MatchImage, 'matchimage');
  }

  async getData(environment: string): Promise<MatchImageAttributes[]> {
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

  private async getProductionData(): Promise<MatchImageAttributes[]> {
    try {
      return productionMatchImages || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): MatchImageAttributes[] {
    try {
      return testMatchImages || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): MatchImageAttributes[] {
    try {
      return developmentMatchImages || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
