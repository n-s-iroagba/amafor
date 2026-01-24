;
import logger from '../../utils/logger';
import { developmentFixtureImages } from '../data/development/matchimages';
import { productionFixtureImages } from '../data/production/matchimages';
import { testFixtureImages } from '../data/testing/matchimages';
import FixtureImage, { FixtureImageAttributes } from '../../models/FixtureImage';
import { BaseSeeder } from './base-seeder';

export class FixtureImageSeeder extends BaseSeeder<FixtureImage> {
  constructor() {
    super(FixtureImage, 'matchimage');
  }

  async getData(environment: string): Promise<FixtureImageAttributes[]> {
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

  private async getProductionData(): Promise<FixtureImageAttributes[]> {
    try {
      return productionFixtureImages || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): FixtureImageAttributes[] {
    try {
      return testFixtureImages || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): FixtureImageAttributes[] {
    try {
      return developmentFixtureImages || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
