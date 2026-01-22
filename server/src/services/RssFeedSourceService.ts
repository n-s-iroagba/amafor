
import { RssFeedSourceRepository } from '@repositories/index';
import { RssFeedSource } from '../models/RssFeedSource';

export class RssFeedSourceService {
  private rssFeedSourceRepository: RssFeedSourceRepository;

  constructor() {
    this.rssFeedSourceRepository = new RssFeedSourceRepository();
  }

  async getAllFeedSources() {
    return (await this.rssFeedSourceRepository.findAll());
  }

  async getFeedSourceById(id: string): Promise<RssFeedSource | null> {
    return await this.rssFeedSourceRepository.findById(id);
  }



  async createFeedSource(feedSourceData: Partial<RssFeedSource>): Promise<RssFeedSource> {
    return await this.rssFeedSourceRepository.create(feedSourceData);
  }

  async updateFeedSource(id: string, feedSourceData: Partial<RssFeedSource>): Promise<[number,RssFeedSource[]]> {
    return await this.rssFeedSourceRepository.update(id, feedSourceData);
  }

  async deleteFeedSource(id: string): Promise<number> {
    return await this.rssFeedSourceRepository.delete(id);
  }


  async updateFetchStatus(id: string, status: string): Promise<void> {
    await this.rssFeedSourceRepository.update(id, status);
  }

  async getFeedsNeedingUpdate(thresholdMinutes: number = 30): Promise<RssFeedSource[]> {
    return await this.rssFeedSourceRepository.getFeedsNeedingUpdate(thresholdMinutes);
  }
}