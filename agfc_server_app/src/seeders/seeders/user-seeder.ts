
import { User } from '@models/User';
import { UserAttributes } from '@models/User';
import logger from '@utils/logger';
import { developmentUsers } from '../data/development/users';
import { productionUsers } from '../data/production/users';
import { testUsers } from '../data/testing/users';
import { BaseSeeder } from './base-seeder';

export class UserSeeder extends BaseSeeder<User> {
  constructor() {
    super(User, 'user');
  }

  async getData(environment: string): Promise<UserAttributes[]> {
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

  private async getProductionData(): Promise<UserAttributes[]> {
    try {
      return productionUsers || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): UserAttributes[] {
    try {
      return testUsers || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): UserAttributes[] {
    try {
      return developmentUsers || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
