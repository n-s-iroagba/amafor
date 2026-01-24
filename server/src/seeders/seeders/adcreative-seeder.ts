
import logger from '../../utils/logger';
import { developmentAdCreatives } from '../data/development/adcreatives';
import { productionAdCreatives } from '../data/production/adcreatives';
import { testAdCreatives } from '../data/testing/adcreatives';
import AdCreative, { AdCreativeAttributes } from '../../models/AdCreative';
import { BaseSeeder } from './base-seeder';

export class AdCreativeSeeder extends BaseSeeder<AdCreative> {
  constructor() {
    super(AdCreative, 'adcreative');
  }

  async getData(environment: string): Promise<AdCreativeAttributes[]> {
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

  private async getProductionData(): Promise<AdCreativeAttributes[]> {
    try {
      return productionAdCreatives || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): AdCreativeAttributes[] {
    try {
      return testAdCreatives || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): AdCreativeAttributes[] {
    try {
      return developmentAdCreatives || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
