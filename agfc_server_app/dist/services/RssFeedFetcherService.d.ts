/// <reference types="node" />
import { RssFeedSource, RssFeedSourceCategory } from '../models/RssFeedSource';
import { ThirdPartyArticle } from '../models/ThirdPartyArticle';
export declare class RssFeedFetcherService {
    private rssFeedSourceService;
    private thirdPartyArticleRepository;
    private parser;
    constructor();
    fetchFeeds(category: RssFeedSourceCategory, page?: number | string, limit?: number | string): Promise<{
        success: number;
        errors: number;
        articles: ThirdPartyArticle[];
    }>;
    fetchFeed(feed: RssFeedSource): Promise<ThirdPartyArticle[] | void>;
    private processFeedItem;
    private extractThumbnailUrl;
    scheduleRegularFetch(intervalMinutes?: number): Promise<NodeJS.Timeout>;
}
//# sourceMappingURL=RssFeedFetcherService.d.ts.map