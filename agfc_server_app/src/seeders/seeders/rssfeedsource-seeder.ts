
import { RssFeedSource } from '@models/RssFeedSource';
import { RssFeedSourceAttributes } from '@models/RssFeedSource';
import logger from '../../utils/logger';
import { developmentRssFeedSources } from '../data/development/rssfeedsources';
import { productionRssFeedSources } from '../data/production/rssfeedsources';
import { testRssFeedSources } from '../data/testing/rssfeedsources';
import { BaseSeeder } from './base-seeder';

export class RssFeedSourceSeeder extends BaseSeeder<RssFeedSource> {
  constructor() {
    super(RssFeedSource, 'rssfeedsource');
  }

  async getData(environment: string): Promise<RssFeedSourceAttributes[]> {
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

  private async getProductionData(): Promise<RssFeedSourceAttributes[]> {
    try {
      return productionRssFeedSources || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): RssFeedSourceAttributes[] {
    try {
      return testRssFeedSources || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): RssFeedSourceAttributes[] {
    try {
      return developmentRssFeedSources || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
