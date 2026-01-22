import logger from '@utils/logger';
import { tracer } from '@utils/tracer';
import redisClient from 'src/redis/redisClient';
import { PaginatedData } from 'src/types';
import { FeaturedNewsRepository } from '@repositories/FeaturedNewsRepository';
import FeaturedNews from '@models/FeaturedNews';
import { RssFeedFetcherService } from './RssFeedFetcherService';



export class FeaturedNewsService {
  private featuredNewsRepository: FeaturedNewsRepository;
  private rssFetcherFeedService: RssFeedFetcherService
  private readonly CACHE_TTL = 300; // 5 minutes in seconds
  private readonly HOMEPAGE_CACHE_KEY = 'homepage:FeaturedNewss';
  private readonly PUBLISHED_CACHE_PREFIX = 'FeaturedNewss:published:';

  constructor() {
    this.featuredNewsRepository = new FeaturedNewsRepository();
    this.rssFetcherFeedService = new RssFeedFetcherService()
  }

  // Get home page featured news with caching
  async fetchHomepageFeaturedNews(): Promise<FeaturedNews[]> {
    return tracer.startActiveSpan('service.FeaturedNews.fetchHomepageFeaturedNews', async (span) => {
      try {
        // Try to get from Redis cache
        const cachedData = await this.getFromCache<FeaturedNews[]>(this.HOMEPAGE_CACHE_KEY);

        if (cachedData) {
          logger.debug('Serving home page featured news from cache');
          span.setAttribute('cache.hit', true);
          return cachedData;
        }

        span.setAttribute('cache.hit', false);

        // Fetch fresh data from database
        const latest = await this.featuredNewsRepository.findRecentNews()



        // Cache the result
        await this.setCache(this.HOMEPAGE_CACHE_KEY, latest, this.CACHE_TTL);


        span.setAttribute('FeaturedNews.latest', latest.length);


        return latest;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching home page featured news', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Get all published Featured News with pagination and caching
  async getAllNews(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {},
    sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}
  ): Promise<PaginatedData<FeaturedNews>> {
    return tracer.startActiveSpan('service.FeaturedNews.getAllNews', async (span) => {
      try {
        span.setAttributes({
          page,
          limit,
          ...filters,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder
        });

        // Generate cache key based on parameters
        const cacheKey = this.generateNewsCacheKey(page, limit, filters, sort);

        // Try to get from Redis cache
        const cachedData = await this.getFromCache<PaginatedData<FeaturedNews>>(cacheKey);

        if (cachedData) {
          logger.debug(`Serving published FeaturedNewss page ${page} from cache`);
          span.setAttribute('cache.hit', true);
          return cachedData;
        }

        span.setAttribute('cache.hit', false);

        // Fetch from database with pagination
        const order: any = sort.sortBy ? [[sort.sortBy, sort.sortOrder || 'DESC']] : [['publishedAt', 'DESC']];
        const result = await this.featuredNewsRepository.paginate(page, limit, { where: filters, order });

        const paginatedData: PaginatedData<FeaturedNews> = {
          data: result.data,
          total: result.total,
          page: result.page,
          limit,
          totalPages: result.totalPages,
          hasNext: result.hasNext,
          hasPrev: result.hasPrevious
        };

        // Cache the result
        await this.setCache(cacheKey, paginatedData, this.CACHE_TTL);

        // Also update homepage cache if this is first page with no filters
        if (page === 1 && !Object.keys(filters).length && !sort.sortBy) {
          await this.invalidateHomepageCache();
        }

        span.setAttribute('FeaturedNewss.count', result.data.length);
        span.setAttribute('total', result.total);

        return paginatedData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching published FeaturedNewss', { error, page, limit, filters, sort });
        throw error;
      } finally {
        span.end();
      }
    });
  }


  // Invalidate cache when FeaturedNewss are created/updated
  async invalidateFeaturedNewsCache(FeaturedNewsId?: string): Promise<void> {
    return tracer.startActiveSpan('service.FeaturedNews.invalidateFeaturedNewsCache', async (span) => {
      try {
        span.setAttribute('FeaturedNewsId', FeaturedNewsId || 'all');

        if (FeaturedNewsId) {
          // Invalidate specific FeaturedNews cache
          await redisClient.del(`FeaturedNews:${FeaturedNewsId}`);
        }

        // Invalidate all published FeaturedNewss caches
        const keys = await redisClient.keys(`${this.PUBLISHED_CACHE_PREFIX}*`);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }

        // Invalidate homepage cache
        await this.invalidateHomepageCache();

        logger.info(`FeaturedNews cache invalidated for ${FeaturedNewsId || 'all FeaturedNewss'}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error invalidating FeaturedNews cache', { error });
        // Don't throw - cache invalidation shouldn't break the flow
      } finally {
        span.end();
      }
    });
  }



  // Private helper methods
  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.warn(`Redis cache read error for key ${key}`, { error });
      return null;
    }
  }

  private async setCache<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (error) {
      logger.warn(`Redis cache write error for key ${key}`, { error });
    }
  }


  private generateNewsCacheKey(
    page: number,
    limit: number,
    filters: Record<string, any>,
    sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): string {
    const filterStr = Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');

    const sortStr = `${sort.sortBy || 'publishedAt'}:${sort.sortOrder || 'desc'}`;

    return `${this.PUBLISHED_CACHE_PREFIX}page:${page}:limit:${limit}:filters:${filterStr}:sort:${sortStr}`;
  }

  private async invalidateHomepageCache(): Promise<void> {
    try {
      await redisClient.del(this.HOMEPAGE_CACHE_KEY);
    } catch (error) {
      logger.warn('Error invalidating homepage cache', { error });
    }
  }

  // Warm up cache (can be called on server startup)
  async warmCache(): Promise<void> {
    try {
      logger.info('Warming up FeaturedNews cache...');

      // Cache home page featured news
      await this.rssFetcherFeedService.fetchFeeds();

      // Cache first 3 pages of published FeaturedNewss
      const promises = [];
      for (let page = 1; page <= 3; page++) {
        promises.push(this.getAllNews(page, 10));
      }

      await Promise.all(promises);
      logger.info('FeaturedNews cache warmed up successfully');
    } catch (error) {
      logger.error('Error warming up FeaturedNews cache', { error });
    }
  }
}

export default new FeaturedNewsService();