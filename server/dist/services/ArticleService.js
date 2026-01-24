"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
// src/services/ArticleService.ts
const ArticleRepository_1 = require("@repositories/ArticleRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
const redisClient_1 = __importDefault(require("src/redis/redisClient"));
class ArticleService {
    constructor() {
        this.CACHE_TTL = 300; // 5 minutes in seconds
        this.HOMEPAGE_CACHE_KEY = 'homepage:articles';
        this.PUBLISHED_CACHE_PREFIX = 'articles:published:';
        this.articleRepository = new ArticleRepository_1.ArticleRepository();
    }
    // Get homepage articles with caching
    async fetchHomepageArticles() {
        return tracer_1.tracer.startActiveSpan('service.Article.fetchHomepageArticles', async (span) => {
            try {
                // Try to get from Redis cache
                const cachedData = await this.getFromCache(this.HOMEPAGE_CACHE_KEY);
                if (cachedData) {
                    logger_1.default.debug('Serving homepage articles from cache');
                    span.setAttribute('cache.hit', true);
                    return cachedData;
                }
                span.setAttribute('cache.hit', false);
                // Fetch fresh data from database
                const latest = await this.articleRepository.findPublished({}, { sortBy: 'publishedAt', sortOrder: 'desc' }, { page: 1, limit: 5 });
                // Cache the result
                await this.setCache(this.HOMEPAGE_CACHE_KEY, latest, this.CACHE_TTL);
                span.setAttribute('articles.latest', latest.data.length);
                return latest.data;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching homepage articles', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Get all published articles with pagination and caching
    async fetchAllPublishedArticles(page = 1, limit = 10, filters = {}, sort = {}) {
        return tracer_1.tracer.startActiveSpan('service.Article.fetchAllPublishedArticles', async (span) => {
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
                const cachedData = await this.getFromCache(cacheKey);
                if (cachedData) {
                    logger_1.default.debug(`Serving published articles page ${page} from cache`);
                    span.setAttribute('cache.hit', true);
                    return cachedData;
                }
                span.setAttribute('cache.hit', false);
                // Fetch from database with pagination
                const result = await this.articleRepository.findPublished(filters, sort, { page, limit });
                const paginatedData = {
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching published articles', { error, page, limit, filters, sort });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Get single article with caching
    async getArticleById(id) {
        return tracer_1.tracer.startActiveSpan('service.Article.getArticleById', async (span) => {
            try {
                span.setAttribute('id', id);
                const cacheKey = `article:${id}`;
                const cachedArticle = await this.getFromCache(cacheKey);
                if (cachedArticle) {
                    logger_1.default.debug(`Serving article ${id} from cache`);
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error fetching article ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Invalidate cache when articles are created/updated
    async invalidateArticleCache(articleId) {
        return tracer_1.tracer.startActiveSpan('service.Article.invalidateArticleCache', async (span) => {
            try {
                span.setAttribute('articleId', articleId || 'all');
                if (articleId) {
                    // Invalidate specific article cache
                    await redisClient_1.default.del(`article:${articleId}`);
                }
                // Invalidate all published articles caches
                const keys = await redisClient_1.default.keys(`${this.PUBLISHED_CACHE_PREFIX}*`);
                if (keys.length > 0) {
                    await redisClient_1.default.del(keys);
                }
                // Invalidate homepage cache
                await this.invalidateHomepageCache();
                logger_1.default.info(`Article cache invalidated for ${articleId || 'all articles'}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error invalidating article cache', { error });
                // Don't throw - cache invalidation shouldn't break the flow
            }
            finally {
                span.end();
            }
        });
    }
    // Get articles by tag
    async getArticlesByTag(tag, page = 1, limit = 10) {
        return this.fetchAllPublishedArticles(page, limit, { tag }, { sortBy: 'publishedAt', sortOrder: 'desc' });
    }
    // Get articles by author
    async getArticlesByAuthor(authorId, page = 1, limit = 10) {
        return this.fetchAllPublishedArticles(page, limit, { author: authorId }, { sortBy: 'publishedAt', sortOrder: 'desc' });
    }
    // Search articles
    async searchArticles(query, page = 1, limit = 10) {
        return this.fetchAllPublishedArticles(page, limit, { search: query }, { sortBy: 'publishedAt', sortOrder: 'desc' });
    }
    // Private helper methods
    async getFromCache(key) {
        try {
            const data = await redisClient_1.default.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            logger_1.default.warn(`Redis cache read error for key ${key}`, { error });
            return null;
        }
    }
    async setCache(key, data, ttl) {
        try {
            await redisClient_1.default.set(key, JSON.stringify(data), 'EX', ttl);
        }
        catch (error) {
            logger_1.default.warn(`Redis cache write error for key ${key}`, { error });
        }
    }
    generatePublishedCacheKey(page, limit, filters, sort) {
        const filterStr = Object.entries(filters)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}:${value}`)
            .join('|');
        const sortStr = `${sort.sortBy || 'publishedAt'}:${sort.sortOrder || 'desc'}`;
        return `${this.PUBLISHED_CACHE_PREFIX}page:${page}:limit:${limit}:filters:${filterStr}:sort:${sortStr}`;
    }
    async invalidateHomepageCache() {
        try {
            await redisClient_1.default.del(this.HOMEPAGE_CACHE_KEY);
        }
        catch (error) {
            logger_1.default.warn('Error invalidating homepage cache', { error });
        }
    }
    // Warm up cache (can be called on server startup)
    async warmCache() {
        try {
            logger_1.default.info('Warming up article cache...');
            // Cache homepage articles
            await this.fetchHomepageArticles();
            // Cache first 3 pages of published articles
            const promises = [];
            for (let page = 1; page <= 3; page++) {
                promises.push(this.fetchAllPublishedArticles(page, 10));
            }
            await Promise.all(promises);
            logger_1.default.info('Article cache warmed up successfully');
        }
        catch (error) {
            logger_1.default.error('Error warming up article cache', { error });
        }
    }
    // Get analytics
    async getAnalytics(dateFrom, dateTo) {
        return tracer_1.tracer.startActiveSpan('service.Article.getAnalytics', async (span) => {
            try {
                const analytics = await this.articleRepository.getAnalytics(dateFrom, dateTo);
                return analytics;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching analytics', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Create article
    async createArticle(data) {
        return tracer_1.tracer.startActiveSpan('service.Article.createArticle', async (span) => {
            try {
                const article = await this.articleRepository.create(data);
                await this.invalidateArticleCache();
                return article;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating article', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Update article
    async updateArticle(id, data) {
        return tracer_1.tracer.startActiveSpan('service.Article.updateArticle', async (span) => {
            try {
                const [affectedCount, affectedRows] = await this.articleRepository.update(id, data);
                const updatedArticle = affectedRows && affectedRows.length > 0 ? affectedRows[0] : null;
                await this.invalidateArticleCache(id);
                return updatedArticle;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating article ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Delete article
    async deleteArticle(id) {
        return tracer_1.tracer.startActiveSpan('service.Article.deleteArticle', async (span) => {
            try {
                await this.articleRepository.delete(id);
                await this.invalidateArticleCache(id);
                return true;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error deleting article ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.ArticleService = ArticleService;
exports.default = new ArticleService();
//# sourceMappingURL=ArticleService.js.map