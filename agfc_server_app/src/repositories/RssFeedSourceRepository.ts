// repositories/RssFeedSourceRepository.ts
import { BaseRepository } from './BaseRepository';
import { RssFeedSource } from '../models/RssFeedSource';
import { Op } from 'sequelize';

export class RssFeedSourceRepository extends BaseRepository<RssFeedSource> {
  constructor() {
    super(RssFeedSource);
  }

  async findByUrl(feedUrl: string): Promise<RssFeedSource | null> {
    return RssFeedSource.findOne({ where: { feedUrl: feedUrl } });
  }

  async findByCategory(category: string): Promise<RssFeedSource[]> {
    return RssFeedSource.findAll({ where: { category } });
  }



  async updateFetchStatus(id: number, status: string): Promise<void> {
    await RssFeedSource.update(
      { 
        lastFetchedAt: new Date(),
        fetchStatus: status 
      },
      { where: { id } }
    );
  }

  async getFeedsNeedingUpdate(thresholdMinutes: number = 30): Promise<RssFeedSource[]> {
    const thresholdDate = new Date(Date.now() - thresholdMinutes * 60 * 1000);
    
    return RssFeedSource.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { lastFetchedAt: { [Op.lt]: thresholdDate } },
          { lastFetchedAt: null }
        ]
      }
    });
  }
}