

// seeders/ThirdPartyArticleSeeder.ts
import ThirdPartyArticle, { ThirdPartyArticleAttributes } from "../../models/ThirdPartyArticle";
import logger from "../../utils/logger";
import { developmentThirdPartyArticles } from "../data/development/thirdPartyArticles";
import { BaseSeeder } from "./base-seeder";

export class ThirdPartyArticleSeeder extends BaseSeeder<ThirdPartyArticle> {
  constructor() {
    super(ThirdPartyArticle, 'third_party_article');
  }

  async getData(environment: string): Promise<ThirdPartyArticleAttributes[]> {
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

  private getDevelopmentData(): ThirdPartyArticleAttributes[] {
    try {
      return developmentThirdPartyArticles || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }
}