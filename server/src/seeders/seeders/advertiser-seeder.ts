// seeders/AdvertiserSeeder.ts
import Advertiser, { AdvertiserAttributes } from "../../models/Advertiser";
import logger from "../../utils/logger";
import { developmentAdvertisers } from "../data/development/advertiser";
import { BaseSeeder } from "./base-seeder";

export class AdvertiserSeeder extends BaseSeeder<Advertiser> {
  constructor() {
    super(Advertiser, 'advertiser');
  }

  async getData(environment: string): Promise<AdvertiserAttributes[]> {
    logger.info(`Loading ${this.name} data for ${environment} environment`);

    switch (environment) {
      case 'production':
        return this.getDevelopmentData();
      case 'test':
        return [];
      case 'development':
      default:
        return this.getDevelopmentData();
    }
  }

  private getDevelopmentData(): AdvertiserAttributes[] {
    try {
      return developmentAdvertisers || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }
}