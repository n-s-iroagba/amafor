
import { SystemNotification } from '../../models/SystemNotification';
import { SystemNotificationAttributes } from '../../models/SystemNotification';
import logger from '../../utils/logger';
import { developmentSystemNotifications } from '../data/development/systemnotifications';
import { productionSystemNotifications } from '../data/production/systemnotifications';
import { testSystemNotifications } from '../data/testing/systemnotifications';
import { BaseSeeder } from './base-seeder';

export class SystemNotificationSeeder extends BaseSeeder<SystemNotification> {
  constructor() {
    super(SystemNotification, 'systemnotification');
  }

  async getData(environment: string): Promise<SystemNotificationAttributes[]> {
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

  private async getProductionData(): Promise<SystemNotificationAttributes[]> {
    try {
      return productionSystemNotifications || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): SystemNotificationAttributes[] {
    try {
      return testSystemNotifications || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): SystemNotificationAttributes[] {
    try {
      return developmentSystemNotifications || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
