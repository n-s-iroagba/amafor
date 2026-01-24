import AcademyStaff, { AcademyStaffAttributes } from "../../models/AcademyStaff";
import logger from "@utils/logger";
import { developmentAcademyStaff } from "../data/development/academystaffs";
import { productionAcademyStaffs } from "../data/production/academystaffs";
import { testAcademyStaffs } from "../data/testing/academystaffs";
import { BaseSeeder } from "./base-seeder";


export class AcademyStaffSeeder extends BaseSeeder<AcademyStaff> {
  constructor() {
    super(AcademyStaff, 'academy-staff');
  }

  async getData(environment: string): Promise<AcademyStaffAttributes[]> {
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

  private async getProductionData(): Promise<AcademyStaffAttributes[]> {
    try {
      return productionAcademyStaffs || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): AcademyStaffAttributes[] {
    try {
      return testAcademyStaffs || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): AcademyStaffAttributes[] {
    try {
      return developmentAcademyStaff || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
