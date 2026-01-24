
import { Article } from '../../models/Article';
import { ArticleAttributes } from '../../models/Article';
import logger from '../../utils/logger';
import { developmentArticles } from '../data/development/articles';
import { productionArticles } from '../data/production/articles';
import { testArticles } from '../data/testing/articles';
import { BaseSeeder } from './base-seeder';

export class ArticleSeeder extends BaseSeeder<Article> {
  constructor() {
    super(Article, 'article');
  }

  async getData(environment: string): Promise<ArticleAttributes[]> {
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

  private async getProductionData(): Promise<ArticleAttributes[]> {
    try {
      return productionArticles || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): ArticleAttributes[] {
    try {
      return testArticles || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): ArticleAttributes[] {
    try {
      return developmentArticles || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
