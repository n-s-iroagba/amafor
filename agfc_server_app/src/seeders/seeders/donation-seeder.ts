
import { Donation } from '@models/Donation';
import { DonationAttributes } from '@models/Donation';
import logger from '../../utils/logger';
import { developmentDonations } from '../data/development/donations';
import { productionDonations } from '../data/production/donations';
import { testDonations } from '../data/testing/donations';
import { BaseSeeder } from './base-seeder';

export class DonationSeeder extends BaseSeeder<Donation> {
  constructor() {
    super(Donation, 'donation');
  }

  async getData(environment: string): Promise<DonationAttributes[]> {
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

  private async getProductionData(): Promise<DonationAttributes[]> {
    try {
      return productionDonations || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): DonationAttributes[] {
    try {
      return testDonations || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): DonationAttributes[] {
    try {
      return developmentDonations || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
