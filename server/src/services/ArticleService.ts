// src/services/ArticleService.ts
import { ArticleRepository, ArticleFilterOptions, ArticleSortOptions } from '@repositories/ArticleRepository';
import { Article, ArticleTag } from '@models/Article';

import logger from '@utils/logger';
import { tracer } from '@utils/tracer';
import redisClient from 'src/redis/redisClient';

import { PaginatedData } from 'src/types';

export interface HomepageArticles {
  featured: Article[];
  latest: Article[];
  trending: Article[];
  byCategory: Record<string, Article[]>;
}

export class ArticleService {
  private articleRepository: ArticleRepository;
  private readonly CACHE_TTL = 300; // 5 minutes in seconds
  private readonly HOMEPAGE_CACHE_KEY = 'homepage:articles';
  private readonly PUBLISHED_CACHE_PREFIX = 'articles:published:';

  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  // Get homepage articles with caching
  async fetchHomepageArticles(): Promise<Article[]> {
    return tracer.startActiveSpan('service.Article.fetchHomepageArticles', async (span) => {
      try {
        // Try to get from Redis cache
        const cachedData = await this.getFromCache<Article[]>(this.HOMEPAGE_CACHE_KEY);

        if (cachedData) {
          logger.debug('Serving homepage articles from cache');
          span.setAttribute('cache.hit', true);
          return cachedData;
        }

        span.setAttribute('cache.hit', false);

        // Fetch fresh data from database
        const latest = await this.articleRepository.findPublished({}, { sortBy: 'publishedAt', sortOrder: 'desc' }, { page: 1, limit: 5 })



        // Cache the result
        await this.setCache(this.HOMEPAGE_CACHE_KEY, latest, this.CACHE_TTL);


        span.setAttribute('articles.latest', latest.data.length);


        return latest.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching homepage articles', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Get all published articles with pagination and caching
  async fetchAllPublishedArticles(
    page: number = 1,
    limit: number = 10,
    filters: ArticleFilterOptions = {},
    sort: ArticleSortOptions = {}
  ): Promise<PaginatedData<Article>> {
    return tracer.startActiveSpan('service.Article.fetchAllPublishedArticles', async (span) => {
      try {
        span.setAttributes({
          page,
          limit,
          filters: JSON.stringify(filters),
          sort: JSON.stringify(sort)
        });

        // Generate cache key based on parameters
        const cacheKey = this.generatePublishedCacheKey(page, limit, filters, sort);

        // Try to get from Redis cache
        const cachedData = await this.getFromCache<PaginatedData<Article>>(cacheKey);

        if (cachedData) {
          logger.debug(`Serving published articles page ${page} from cache`);
          span.setAttribute('cache.hit', true);
          return cachedData;
        }

        span.setAttribute('cache.hit', false);

        // Fetch from database with pagination
        const result = await this.articleRepository.findPublished(filters, sort, { page, limit });

        const paginatedData: PaginatedData<Article> = {
          data: result.data,
          total: result.total,
          page: result.page,
          limit,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        };

        // Cache the result
        await this.setCache(cacheKey, paginatedData, this.CACHE_TTL);

        // Also update homepage cache if this is first page with no filters
        if (page === 1 && !Object.keys(filters).length && !sort.sortBy) {
          await this.invalidateHomepageCache();
        }

        span.setAttribute('articles.count', result.data.length);
        span.setAttribute('total', result.total);

        return paginatedData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error fetching published articles', { error, page, limit, filters, sort });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Get single article with caching
  async getArticleById(id: string): Promise<Article | null> {
    return tracer.startActiveSpan('service.Article.getArticleById', async (span) => {
      try {
        span.setAttribute('id', id);

        const cacheKey = `article:${id}`;
        const cachedArticle = await this.getFromCache<Article>(cacheKey);

        if (cachedArticle) {
          logger.debug(`Serving article ${id} from cache`);
          span.setAttribute('cache.hit', true);
          return cachedArticle;
        }

        span.setAttribute('cache.hit', false);
        const article = await this.articleRepository.findById(id, {
          include: ['author']
        });

        if (article && article.status === 'published') {
          await this.setCache(cacheKey, article, this.CACHE_TTL * 2); // Longer TTL for single articles
          await this.articleRepository.incrementViewCount(id);
        }

        return article;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error fetching article ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Invalidate cache when articles are created/updated
  async invalidateArticleCache(articleId?: string): Promise<void> {
    return tracer.startActiveSpan('service.Article.invalidateArticleCache', async (span) => {
      try {
        span.setAttribute('articleId', articleId || 'all');

        if (articleId) {
          // Invalidate specific article cache
          await redisClient.del(`article:${articleId}`);
        }

        // Invalidate all published articles caches
        const keys = await redisClient.keys(`${this.PUBLISHED_CACHE_PREFIX}*`);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }

        // Invalidate homepage cache
        await this.invalidateHomepageCache();

        logger.info(`Article cache invalidated for ${articleId || 'all articles'}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error invalidating article cache', { error });
        // Don't throw - cache invalidation shouldn't break the flow
      } finally {
        span.end();
      }
    });
  }

  // Get articles by tag
  async getArticlesByTag(tag: ArticleTag, page: number = 1, limit: number = 10): Promise<PaginatedData<Article>> {
    return this.fetchAllPublishedArticles(page, limit, { tag }, { sortBy: 'publishedAt', sortOrder: 'desc' });
  }

  // Get articles by author
  async getArticlesByAuthor(authorId: string, page: number = 1, limit: number = 10): Promise<PaginatedData<Article>> {
    return this.fetchAllPublishedArticles(page, limit, { author: authorId }, { sortBy: 'publishedAt', sortOrder: 'desc' });
  }

  // Search articles
  async searchArticles(query: string, page: number = 1, limit: number = 10): Promise<PaginatedData<Article>> {
    return this.fetchAllPublishedArticles(page, limit, { search: query }, { sortBy: 'publishedAt', sortOrder: 'desc' });
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


  private generatePublishedCacheKey(
    page: number,
    limit: number,
    filters: ArticleFilterOptions,
    sort: ArticleSortOptions
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
      logger.info('Warming up article cache...');

      // Cache homepage articles
      await this.fetchHomepageArticles();

      // Cache first 3 pages of published articles
      const promises = [];
      for (let page = 1; page <= 3; page++) {
        promises.push(this.fetchAllPublishedArticles(page, 10));
      }

      await Promise.all(promises);
      logger.info('Article cache warmed up successfully');
    } catch (error) {
      logger.error('Error warming up article cache', { error });
    }
  }
}

export default new ArticleService();