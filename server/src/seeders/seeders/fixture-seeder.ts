
import { Fixture } from '../../models/Fixture';
import { FixtureAttributes } from '../../models/Fixture';
import logger from '../../utils/logger';
import { developmentFixtures } from '../data/development/fixtures';
import { productionFixtures } from '../data/production/fixtures';
import { testFixtures } from '../data/testing/fixtures';
import { BaseSeeder } from './base-seeder';

export class FixtureSeeder extends BaseSeeder<Fixture> {
  constructor() {
    super(Fixture, 'fixture');
  }

  async getData(environment: string): Promise<FixtureAttributes[]> {
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

  private async getProductionData(): Promise<FixtureAttributes[]> {
    try {
      return productionFixtures || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): FixtureAttributes[] {
    try {
      return testFixtures || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): FixtureAttributes[] {
    try {
      return developmentFixtures || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
