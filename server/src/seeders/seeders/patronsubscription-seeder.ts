
import { PatronSubscription } from '../../models/PatronSubscription';
import { PatronSubscriptionAttributes } from '../../models/PatronSubscription';
import logger from "../../utils/logger";
import { developmentPatronSubscriptions } from '../data/development/patronsubscriptions';
import { productionPatronSubscriptions } from '../data/production/patronsubscriptions';
import { testPatronSubscriptions } from '../data/testing/patronsubscriptions';
import { BaseSeeder } from './base-seeder';

export class PatronSubscriptionSeeder extends BaseSeeder<PatronSubscription> {
  constructor() {
    super(PatronSubscription, 'patronsubscription');
  }

  async getData(environment: string): Promise<PatronSubscriptionAttributes[]> {
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

  private async getProductionData(): Promise<PatronSubscriptionAttributes[]> {
    try {
      return productionPatronSubscriptions || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): PatronSubscriptionAttributes[] {
    try {
      return testPatronSubscriptions || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): PatronSubscriptionAttributes[] {
    try {
      return developmentPatronSubscriptions || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
