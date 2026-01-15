
import logger from '@utils/logger';
import { developmentGoals } from '../data/development/goals';
import { productionGoals } from '../data/production/goals';
import { testGoals } from '../data/testing/goals';
import Goal, { GoalAttributes } from '@models/Goal';
import { BaseSeeder } from './base-seeder';

export class GoalSeeder extends BaseSeeder<Goal> {
  constructor() {
    super(Goal, 'goal');
  }

  async getData(environment: string): Promise<GoalAttributes[]> {
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

  private async getProductionData(): Promise<GoalAttributes[]> {
    try {
      return productionGoals || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): GoalAttributes[] {
    try {
      return testGoals || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): GoalAttributes[] {
    try {
      return developmentGoals || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
