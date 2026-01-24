
import { Trialist } from '../../models/Trialist';
import { TrialistAttributes } from '../../models/Trialist';
import logger from '../../utils/logger';
import { developmentTrialists } from '../data/development/trialists';
import { productionTrialists } from '../data/production/trialists';
import { testTrialists } from '../data/testing/trialists';
import { BaseSeeder } from './base-seeder';

export class TrialistSeeder extends BaseSeeder<Trialist> {
  constructor() {
    super(Trialist, 'trialist');
  }

  async getData(environment: string): Promise<TrialistAttributes[]> {
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

  private async getProductionData(): Promise<TrialistAttributes[]> {
    try {
      return productionTrialists || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): TrialistAttributes[] {
    try {
      return testTrialists || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): TrialistAttributes[] {
    try {
      return developmentTrialists || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
