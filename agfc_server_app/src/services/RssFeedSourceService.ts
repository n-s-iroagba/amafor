// services/RssFeedSourceService.ts
import { RssFeedSourceRepository } from '../repositories/RssFeedSourceRepository';
import { RssFeedSource } from '../models/RssFeedSource';

export class RssFeedSourceService {
  private rssFeedSourceRepository: RssFeedSourceRepository;

  constructor() {
    this.rssFeedSourceRepository = new RssFeedSourceRepository();
  }

  async getAllFeedSources() {
    return (await this.rssFeedSourceRepository.findAll());
  }

  async getFeedSourceById(id: number): Promise<RssFeedSource | null> {
    return await this.rssFeedSourceRepository.findById(id);
  }

  async getFeedSourceByUrl(feedUrl: string): Promise<RssFeedSource | null> {
    return await this.rssFeedSourceRepository.findByUrl(feedUrl);
  }

  async createFeedSource(feedSourceData: Partial<RssFeedSource>): Promise<RssFeedSource> {
    return await this.rssFeedSourceRepository.create(feedSourceData);
  }

  async updateFeedSource(id: number, feedSourceData: Partial<RssFeedSource>): Promise<RssFeedSource | null> {
    return await this.rssFeedSourceRepository.updateById(id, feedSourceData);
  }

  async deleteFeedSource(id: number): Promise<boolean> {
    return await this.rssFeedSourceRepository.deleteById(id);
  }

  async getFeedsByCategory(category: string): Promise<RssFeedSource[]> {
    return await this.rssFeedSourceRepository.findByCategory(category);
  }



  async updateFetchStatus(id: number, status: string): Promise<void> {
    await this.rssFeedSourceRepository.updateFetchStatus(id, status);
  }

  async getFeedsNeedingUpdate(thresholdMinutes: number = 30): Promise<RssFeedSource[]> {
    return await this.rssFeedSourceRepository.getFeedsNeedingUpdate(thresholdMinutes);
  }
}