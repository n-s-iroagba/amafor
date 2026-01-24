

// seeders/FeaturedNewsSeeder.ts
import FeaturedNews, { FeaturedNewsAttributes } from "@models/FeaturedNews";
import logger from "../../utils/logger";
// import { developmentFeaturedNewss } from "../data/development/featuredNewss";
import { BaseSeeder } from "./base-seeder";

export class FeaturedNewsSeeder extends BaseSeeder<FeaturedNews> {
  constructor() {
    super(FeaturedNews, 'third_party_article');
  }

  async getData(environment: string): Promise<FeaturedNewsAttributes[]> {
    logger.info(`Loading ${this.name} data for ${environment} environment`);

    switch (environment) {
      case 'production':
        return [];
      case 'test':
        return [];
      case 'development':
      default:
        return this.getDevelopmentData();
    }
  }

  private getDevelopmentData(): FeaturedNewsAttributes[] {
    try {
      return /* developmentFeaturedNewss || */[];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }
}