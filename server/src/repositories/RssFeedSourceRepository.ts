// repositories/RssFeedRepository.ts
import { Op } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import { 
  RssFeedSource, 
} from '@models/RssFeedSource';
import { AuditLogRepository } from './AuditLogRepository';
import logger from '@utils/logger';
import tracer from '@utils/tracer';


export interface RssFeedFilterOptions {
  search?: string;
  isActive?: boolean;
  category?: string;
  fetchStatus?: string;
}

export interface RssFeedSortOptions {
  sortBy?: 'name' | 'feedUrl' | 'lastFetchedAt' | 'createdAt' | 'updateFrequency';
  sortOrder?: 'asc' | 'desc';
}

export class RssFeedSourceRepository extends BaseRepository<RssFeedSource> {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    super(RssFeedSource);
    this.auditLogRepository = new AuditLogRepository();
  }

  async searchFeeds(
    search: string,
    filters: Omit<RssFeedFilterOptions, 'search'> = {},
    sort: RssFeedSortOptions = {},
    pagination?: { page: number; limit: number }
  ): Promise<{ data: RssFeedSource[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.RssFeedSource.searchFeeds', async (span) => {
      try {
        span.setAttributes({
          search,
          filters: JSON.stringify(filters),
          sort: JSON.stringify(sort)
        });

        const where: any = { ...filters };
        
        // Apply search
        if (search) {
          where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { feedUrl: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
          ];
        }

        // Apply sorting
        const order: any[] = [];
        if (sort.sortBy) {
          order.push([sort.sortBy, sort.sortOrder?.toUpperCase() || 'ASC']);
        } else {
          order.push(['name', 'ASC']);
        }

        const options = {
          where,
          order
        };

        if (pagination) {
          return await this.paginate(pagination.page, pagination.limit, options);
        } else {
          const data = await this.findAll(options);
          const total = await this.count({ where });
          return {
            data,
            total,
            page: 1,
            totalPages: 1
          };
        }
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error searching RSS feeds', { error, search, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateFetchStatus(id: string, status: string, lastError?: string): Promise<void> {
    return tracer.startActiveSpan('repository.RssFeedSource.updateFetchStatus', async (span) => {
      try {
        span.setAttributes({
          id,
          status,
          lastError
        });
        
        const updateData: any = {
          fetchStatus: status,
          lastFetchedAt: new Date()
        };
        
        if (lastError) {
          updateData.lastError = lastError;
        }
        
        await this.update(id, updateData);
        
        logger.info(`Updated fetch status for RSS feed ${id}: ${status}`);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error updating fetch status for RSS feed: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getFeedsNeedingUpdate(thresholdMinutes: number = 30): Promise<RssFeedSource[]> {
    return tracer.startActiveSpan('repository.RssFeedSource.getFeedsNeedingUpdate', async (span) => {
      try {
        span.setAttribute('thresholdMinutes', thresholdMinutes);
        const thresholdDate = new Date(Date.now() - thresholdMinutes * 60 * 1000);
        
        const feeds = await this.findAll({
          where: {
            isActive: true,
            [Op.or]: [
              { lastFetchedAt: { [Op.lt]: thresholdDate } },
              { lastFetchedAt: null }
            ]
          },
          order: [
            ['lastFetchedAt', 'ASC NULLS FIRST'],
            ['updateFrequency', 'ASC']
          ]
        });
        
        span.setAttribute('count', feeds.length);
        return feeds;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error getting feeds needing update', { error, thresholdMinutes });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}