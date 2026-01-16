
import logger from '../../utils/logger';
import { developmentVideos } from '../data/development/videos';
import { productionVideos } from '../data/production/videos';
import { testVideos } from '../data/testing/videos';
import Video, { VideoAttributes } from '@models/Video';
import { BaseSeeder } from './base-seeder';

export class VideoSeeder extends BaseSeeder<Video> {
  constructor() {
    super(Video, 'video');
  }

  async getData(environment: string): Promise<VideoAttributes[]> {
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

  private async getProductionData(): Promise<VideoAttributes[]> {
    try {
      return productionVideos || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): VideoAttributes[] {
    try {
      return testVideos || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): VideoAttributes[] {
    try {
      return developmentVideos || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
