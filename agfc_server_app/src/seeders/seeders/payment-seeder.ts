import Payment, { PaymentAttributes } from "@models/Payment";
import logger from "@utils/logger";

import { BaseSeeder } from "./base-seeder";
import { developmentPayments } from "../data/development/payment";
import { productionPayments } from "../data/production/payment";
import { testPayments } from "../data/testing/payment";


export class PaymentSeeder extends BaseSeeder<Payment> {
  constructor() {
    super(Payment, 'Payment');
  }

  async getData(environment: string): Promise<PaymentAttributes[]> {
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

  private async getProductionData(): Promise<PaymentAttributes[]> {
    try {
      return productionPayments || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): PaymentAttributes[] {
    try {
      return testPayments || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): PaymentAttributes[] {
    try {
      return developmentPayments || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
