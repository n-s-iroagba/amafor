
import { AdCampaign } from '../../models/AdCampaign';
import { AdCampaignAttributes } from '../../models/AdCampaign';
import logger from '../../utils/logger';
import { developmentAdCampaigns } from '../data/development/adcampaigns';
import { productionAdCampaigns } from '../data/production/adcampaigns';
import { testAdCampaigns } from '../data/testing/adcampaigns';
import { BaseSeeder } from './base-seeder';

export class AdCampaignSeeder extends BaseSeeder<AdCampaign> {
  constructor() {
    super(AdCampaign, 'adcampaign');
  }

  async getData(environment: string): Promise<AdCampaignAttributes[]> {
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

  private async getProductionData(): Promise<AdCampaignAttributes[]> {
    try {
      return productionAdCampaigns || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): AdCampaignAttributes[] {
    try {
      return testAdCampaigns || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): AdCampaignAttributes[] {
    try {
      return developmentAdCampaigns || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
