import Patron, { PatronAttributes } from "../../models/Patron";
import logger from "../../utils/logger";
import { developmentPatrons } from "../data/development/patron";
import { productionPatrons } from "../data/production/patron";
import { BaseSeeder } from "./base-seeder";
import { testPatrons } from "../data/testing/patron";


export class PatronSeeder extends BaseSeeder<Patron> {
  constructor() {
    super(Patron, 'patron');
  }

  async getData(environment: string): Promise<PatronAttributes[]> {
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

  private async getProductionData(): Promise<PatronAttributes[]> {
    try {
      return productionPatrons || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): PatronAttributes[] {
    try {
      return testPatrons || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): PatronAttributes[] {
    try {
      return developmentPatrons || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
