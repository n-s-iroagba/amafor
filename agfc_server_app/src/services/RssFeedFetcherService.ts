// services/RssFeedFetcherService.ts
import Parser from 'rss-parser';
import { RssFeedSourceService } from './RssFeedSourceService';
import { RssFeedSource, RssFeedSourceCategory } from '../models/RssFeedSource';
import redis from '../redis/redisClient';
import { ThirdPartyArticle, ThirdPartyArticleCreationAttributes } from '../models/ThirdPartyArticle';
import { ThirdPartyArticleRepository } from '@repositories/ThirdPartyArticleRepository';



// Custom type for RSS parser
interface CustomItem {
  [key: string]: any;
}

type CustomFeed = { [key: string]: any };

export class RssFeedFetcherService {
  private rssFeedSourceService: RssFeedSourceService;
  private thirdPartyArticleRepository: ThirdPartyArticleRepository;
  private parser: Parser<CustomFeed, CustomItem>;

  constructor() {
    this.rssFeedSourceService = new RssFeedSourceService();
    this.thirdPartyArticleRepository = new ThirdPartyArticleRepository();
    this.parser = new Parser({
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



  async fetchFeeds(category: RssFeedSourceCategory, page?: number | string, limit?: number | string): Promise<{ success: number; errors: number, articles: ThirdPartyArticle[] }> {
    const cacheKey = `articles:${category}:page:${page}:limit:${limit}`

    // Check cache
    // const cached = await redis.get(cacheKey);
    // if (cached) {
    //   console.log('Returning cached feeds summary');
    //   return JSON.parse(cached);
    // }
    let articles: ThirdPartyArticle[] = []
    const feeds = await this.rssFeedSourceService.getFeedsByCategory(category);
    let successCount = 0;
    let errorCount = 0;

    for (const feed of feeds) {
      try {
        const fetchedArticles = await this.fetchFeed(feed);
        if (fetchedArticles) [...fetchedArticles, articles]
        successCount++;
      } catch (error) {
        console.error(`Error fetching feed ${feed.name}:`, error);
        await this.rssFeedSourceService.updateFetchStatus(feed.id, 'ERROR');
        errorCount++;
      }
    }

    const result = { success: successCount, errors: errorCount, articles: articles };

    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(articles), 'EX', 30000);

    return result;
  }


  async fetchFeed(feed: RssFeedSource): Promise<ThirdPartyArticle[] | void> {
    try {
      console.log(`Fetching feed: ${feed.name}`);

      const parsedFeed = await this.parser.parseURL(feed.feedUrl);

      if (!parsedFeed.items || parsedFeed.items.length === 0) {
        await this.rssFeedSourceService.updateFetchStatus(feed.id, 'EMPTY');
        return;
      }
      let articles: ThirdPartyArticle[] = []
      let processedCount = 0;

      for (const item of parsedFeed.items) {
        try {
          const article = await this.processFeedItem(feed, item);
          articles.push(article)
          processedCount++;
        } catch (itemError) {
          console.error(`Error processing item from ${feed.name}:`, itemError);
        }
      }

      await this.rssFeedSourceService.updateFetchStatus(feed.id, `SUCCESS: ${processedCount} items`);
      console.log(`Processed ${processedCount} items from ${feed.name}`);
      return articles
    } catch (error) {
      await this.rssFeedSourceService.updateFetchStatus(feed.id, 'ERROR');
      throw error;
    }
  }

  private async processFeedItem(feed: RssFeedSource, item: any): Promise<ThirdPartyArticle> {
    const articleUrl = item.link || '';
    const articleData: ThirdPartyArticleCreationAttributes = {
      rssFeedSourceId: feed.id,
      originalId: item.guid || item.id || item.link || Date.now().toString(),
      title: item.title || 'No title',
      summary: item.summary || item.description || null,
      content: item['content:encoded'] || item.content || item.summary || item.description || null,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      thumbnailUrl: this.extractThumbnailUrl(item)
    };
    if (!articleUrl) {
      throw new Error('Article URL is required');
    }
    return (await this.thirdPartyArticleRepository.createOrUpdateArticle(articleData)).article;
  }


  private extractThumbnailUrl(item: any): string | null {
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
      const imgFixture = content.match(/<img[^>]+src="([^">]+)"/);
      if (imgFixture && imgFixture[1]) {
        return imgFixture[1];
      }
    }

    return null;
  }

  async scheduleRegularFetch(intervalMinutes: number = 30): Promise<NodeJS.Timeout> {
    return setInterval(() => {
      // Loop through all RssFeedSourceCategory enum values
      Object.values(RssFeedSourceCategory).forEach(category => {
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