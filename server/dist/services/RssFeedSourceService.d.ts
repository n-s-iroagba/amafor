import { RssFeedSource } from '../models/RssFeedSource';
export declare class RssFeedSourceService {
    private rssFeedSourceRepository;
    constructor();
    getAllFeedSources(): Promise<RssFeedSource[]>;
    getFeedSourceById(id: string): Promise<RssFeedSource | null>;
    createFeedSource(feedSourceData: Partial<RssFeedSource>): Promise<RssFeedSource>;
    updateFeedSource(id: string, feedSourceData: Partial<RssFeedSource>): Promise<[number, RssFeedSource[]]>;
    deleteFeedSource(id: string): Promise<number>;
    updateFetchStatus(id: string, status: string): Promise<void>;
    getFeedsNeedingUpdate(thresholdMinutes?: number): Promise<RssFeedSource[]>;
}
//# sourceMappingURL=RssFeedSourceService.d.ts.map