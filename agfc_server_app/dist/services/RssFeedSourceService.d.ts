import { RssFeedSource } from '../models/RssFeedSource';
export declare class RssFeedSourceService {
    private rssFeedSourceRepository;
    constructor();
    getAllFeedSources(): Promise<any>;
    getFeedSourceById(id: number): Promise<RssFeedSource | null>;
    getFeedSourceByUrl(feedUrl: string): Promise<RssFeedSource | null>;
    createFeedSource(feedSourceData: Partial<RssFeedSource>): Promise<RssFeedSource>;
    updateFeedSource(id: number, feedSourceData: Partial<RssFeedSource>): Promise<RssFeedSource | null>;
    deleteFeedSource(id: number): Promise<boolean>;
    getFeedsByCategory(category: string): Promise<RssFeedSource[]>;
    updateFetchStatus(id: number, status: string): Promise<void>;
    getFeedsNeedingUpdate(thresholdMinutes?: number): Promise<RssFeedSource[]>;
}
//# sourceMappingURL=RssFeedSourceService.d.ts.map