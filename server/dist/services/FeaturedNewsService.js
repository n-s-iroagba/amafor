"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedNewsService = void 0;
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
const redisClient_1 = __importDefault(require("src/redis/redisClient"));
const FeaturedNewsRepository_1 = require("@repositories/FeaturedNewsRepository");
const RssFeedFetcherService_1 = require("./RssFeedFetcherService");
class FeaturedNewsService {
    constructor() {
        this.CACHE_TTL = 300; // 5 minutes in seconds
        this.HOMEPAGE_CACHE_KEY = 'homepage:FeaturedNewss';
        this.PUBLISHED_CACHE_PREFIX = 'FeaturedNewss:published:';
        this.featuredNewsRepository = new FeaturedNewsRepository_1.FeaturedNewsRepository();
        this.rssFetcherFeedService = new RssFeedFetcherService_1.RssFeedFetcherService();
    }
    // Get home page featured news with caching
    async fetchHomepageFeaturedNews() {
        return tracer_1.tracer.startActiveSpan('service.FeaturedNews.fetchHomepageFeaturedNews', async (span) => {
            try {
                // Try to get from Redis cache
                const cachedData = await this.getFromCache(this.HOMEPAGE_CACHE_KEY);
                if (cachedData) {
                    logger_1.default.debug('Serving home page featured news from cache');
                    span.setAttribute('cache.hit', true);
                    return cachedData;
                }
                span.setAttribute('cache.hit', false);
                // Fetch fresh data from database
                const latest = await this.featuredNewsRepository.findRecentNews();
                // Cache the result
                await this.setCache(this.HOMEPAGE_CACHE_KEY, latest, this.CACHE_TTL);
                span.setAttribute('FeaturedNews.latest', latest.length);
                return latest;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching home page featured news', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Get all published Featured News with pagination and caching
    async getAllNews(page = 1, limit = 10, filters = {}, sort = {}) {
        return tracer_1.tracer.startActiveSpan('service.FeaturedNews.getAllNews', async (span) => {
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
                const cachedData = await this.getFromCache(cacheKey);
                if (cachedData) {
                    logger_1.default.debug(`Serving published FeaturedNewss page ${page} from cache`);
                    span.setAttribute('cache.hit', true);
                    return cachedData;
                }
                span.setAttribute('cache.hit', false);
                // Fetch from database with pagination
                const order = sort.sortBy ? [[sort.sortBy, sort.sortOrder || 'DESC']] : [['publishedAt', 'DESC']];
                const result = await this.featuredNewsRepository.paginate(page, limit, { where: filters, order });
                const paginatedData = {
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error fetching published FeaturedNewss', { error, page, limit, filters, sort });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Invalidate cache when FeaturedNewss are created/updated
    async invalidateFeaturedNewsCache(FeaturedNewsId) {
        return tracer_1.tracer.startActiveSpan('service.FeaturedNews.invalidateFeaturedNewsCache', async (span) => {
            try {
                span.setAttribute('FeaturedNewsId', FeaturedNewsId || 'all');
                if (FeaturedNewsId) {
                    // Invalidate specific FeaturedNews cache
                    await redisClient_1.default.del(`FeaturedNews:${FeaturedNewsId}`);
                }
                // Invalidate all published FeaturedNewss caches
                const keys = await redisClient_1.default.keys(`${this.PUBLISHED_CACHE_PREFIX}*`);
                if (keys.length > 0) {
                    await redisClient_1.default.del(keys);
                }
                // Invalidate homepage cache
                await this.invalidateHomepageCache();
                logger_1.default.info(`FeaturedNews cache invalidated for ${FeaturedNewsId || 'all FeaturedNewss'}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error invalidating FeaturedNews cache', { error });
                // Don't throw - cache invalidation shouldn't break the flow
            }
            finally {
                span.end();
            }
        });
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
    generateNewsCacheKey(page, limit, filters, sort) {
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
            logger_1.default.info('Warming up FeaturedNews cache...');
            // Cache home page featured news
            await this.rssFetcherFeedService.fetchFeeds();
            // Cache first 3 pages of published FeaturedNewss
            const promises = [];
            for (let page = 1; page <= 3; page++) {
                promises.push(this.getAllNews(page, 10));
            }
            await Promise.all(promises);
            logger_1.default.info('FeaturedNews cache warmed up successfully');
        }
        catch (error) {
            logger_1.default.error('Error warming up FeaturedNews cache', { error });
        }
    }
}
exports.FeaturedNewsService = FeaturedNewsService;
exports.default = new FeaturedNewsService();
//# sourceMappingURL=FeaturedNewsService.js.map