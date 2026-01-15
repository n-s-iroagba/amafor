


import logger from '@utils/logger';
import { developmentMatchSummarys } from '../data/development/matchsummarys';
import { productionMatchSummarys } from '../data/production/matchsummarys';
import { testMatchSummarys } from '../data/testing/matchsummarys';
import MatchSummary, { MatchSummaryAttributes } from '@models/MatchSummary';
import { BaseSeeder } from './base-seeder';

export class MatchSummarySeeder extends BaseSeeder<MatchSummary> {
  constructor() {
    super(MatchSummary, 'matchsummary');
  }

  async getData(environment: string): Promise<MatchSummaryAttributes[]> {
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

  private async getProductionData(): Promise<MatchSummaryAttributes[]> {
    try {
      return productionMatchSummarys || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): MatchSummaryAttributes[] {
    try {
      return testMatchSummarys || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): MatchSummaryAttributes[] {
    try {
      return developmentMatchSummarys || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
