"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedFetcherService = void 0;
// services/RssFeedFetcherService.ts
const rss_parser_1 = __importDefault(require("rss-parser"));
const RssFeedSourceService_1 = require("./RssFeedSourceService");
const RssFeedSource_1 = require("../models/RssFeedSource");
const redisClient_1 = __importDefault(require("../redis/redisClient"));
const ThirdPartyArticleRepository_1 = require("../repositories/ThirdPartyArticleRepository");
class RssFeedFetcherService {
    constructor() {
        this.rssFeedSourceService = new RssFeedSourceService_1.RssFeedSourceService();
        this.thirdPartyArticleRepository = new ThirdPartyArticleRepository_1.ThirdPartyArticleRepository();
        this.parser = new rss_parser_1.default({
            customFields: {
                item: [
                    'media:content',
                    'media:thumbnail',
                    'content:encoded',
                    'dc:creator'
                ]
            },
            timeout: 10000 // 10 second timeout
        });
    }
    async fetchFeeds(category, page, limit) {
        const cacheKey = `articles:${category}:page:${page}:limit:${limit}`;
        // Check cache
        // const cached = await redis.get(cacheKey);
        // if (cached) {
        //   console.log('Returning cached feeds summary');
        //   return JSON.parse(cached);
        // }
        let articles = [];
        const feeds = await this.rssFeedSourceService.getFeedsByCategory(category);
        let successCount = 0;
        let errorCount = 0;
        for (const feed of feeds) {
            try {
                const fetchedArticles = await this.fetchFeed(feed);
                if (fetchedArticles)
                    [...fetchedArticles, articles];
                successCount++;
            }
            catch (error) {
                console.error(`Error fetching feed ${feed.name}:`, error);
                await this.rssFeedSourceService.updateFetchStatus(feed.id, 'ERROR');
                errorCount++;
            }
        }
        const result = { success: successCount, errors: errorCount, articles: articles };
        // Cache for 5 minutes
        await redisClient_1.default.set(cacheKey, JSON.stringify(articles), 'EX', 30000);
        return result;
    }
    async fetchFeed(feed) {
        try {
            console.log(`Fetching feed: ${feed.name}`);
            const parsedFeed = await this.parser.parseURL(feed.feedUrl);
            if (!parsedFeed.items || parsedFeed.items.length === 0) {
                await this.rssFeedSourceService.updateFetchStatus(feed.id, 'EMPTY');
                return;
            }
            let articles = [];
            let processedCount = 0;
            for (const item of parsedFeed.items) {
                try {
                    const article = await this.processFeedItem(feed, item);
                    articles.push(article);
                    processedCount++;
                }
                catch (itemError) {
                    console.error(`Error processing item from ${feed.name}:`, itemError);
                }
            }
            await this.rssFeedSourceService.updateFetchStatus(feed.id, `SUCCESS: ${processedCount} items`);
            console.log(`Processed ${processedCount} items from ${feed.name}`);
            return articles;
        }
        catch (error) {
            await this.rssFeedSourceService.updateFetchStatus(feed.id, 'ERROR');
            throw error;
        }
    }
    async processFeedItem(feed, item) {
        const articleData = {
            rss_feed_source_id: feed.id,
            original_id: item.guid || item.id || item.link || Date.now().toString(),
            title: item.title || 'No title',
            summary: item.summary || item.description || null,
            content: item['content:encoded'] || item.content || item.summary || item.description || null,
            article_url: item.link || '',
            published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
            thumbnail_url: this.extractThumbnailUrl(item)
        };
        if (!articleData.article_url) {
            throw new Error('Article URL is required');
        }
        return (await this.thirdPartyArticleRepository.createOrUpdateArticle(articleData)).article;
    }
    extractThumbnailUrl(item) {
        // Try to extract thumbnail from various possible locations
        if (item.enclosure && item.enclosure.url) {
            return item.enclosure.url;
        }
        if (item['media:thumbnail'] && item['media:thumbnail'].url) {
            return item['media:thumbnail'].url;
        }
        if (item['media:content'] && item['media:content'].url) {
            return item['media:content'].url;
        }
        // Extract from content (first image)
        if (item.content || item['content:encoded']) {
            const content = item['content:encoded'] || item.content;
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) {
                return imgMatch[1];
            }
        }
        return null;
    }
    async scheduleRegularFetch(intervalMinutes = 30) {
        return setInterval(() => {
            // Loop through all RssFeedSourceCategory enum values
            Object.values(RssFeedSource_1.RssFeedSourceCategory).forEach(category => {
                this.fetchFeeds(category)
                    .then(({ success, errors }) => {
                    console.log(`Scheduled feed fetch (${category}) completed: ${success} succeeded, ${errors} failed`);
                })
                    .catch(error => {
                    console.error(`Scheduled feed fetch (${category}) failed:`, error);
                });
            });
        }, intervalMinutes * 60 * 1000);
    }
}
exports.RssFeedFetcherService = RssFeedFetcherService;
//# sourceMappingURL=RssFeedFetcherService.js.map