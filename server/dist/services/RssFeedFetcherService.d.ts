import { RssFeedSource } from '../models/RssFeedSource';
import { FeaturedNews } from '../models/FeaturedNews';
export declare class RssFeedFetcherService {
    private rssFeedSourceService;
    private featuredNewsRepository;
    private parser;
    constructor();
    fetchFeeds(page?: number | string, limit?: number | string): Promise<{
        success: number;
        errors: number;
        articles: FeaturedNews[];
    }>;
    fetchFeed(feed: RssFeedSource): Promise<FeaturedNews[] | void>;
    private processFeedItem;
    private extractThumbnailUrl;
    scheduleRegularFetch(intervalMinutes?: number): Promise<NodeJS.Timeout>;
}
//# sourceMappingURL=RssFeedFetcherService.d.ts.map