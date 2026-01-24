import { PaginatedData } from 'src/types';
import FeaturedNews from '@models/FeaturedNews';
export declare class FeaturedNewsService {
    private featuredNewsRepository;
    private rssFetcherFeedService;
    private readonly CACHE_TTL;
    private readonly HOMEPAGE_CACHE_KEY;
    private readonly PUBLISHED_CACHE_PREFIX;
    constructor();
    fetchHomepageFeaturedNews(): Promise<FeaturedNews[]>;
    getAllNews(page?: number, limit?: number, filters?: Record<string, any>, sort?: {
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<PaginatedData<FeaturedNews>>;
    invalidateFeaturedNewsCache(FeaturedNewsId?: string): Promise<void>;
    private getFromCache;
    private setCache;
    private generateNewsCacheKey;
    private invalidateHomepageCache;
    warmCache(): Promise<void>;
}
declare const _default: FeaturedNewsService;
export default _default;
//# sourceMappingURL=FeaturedNewsService.d.ts.map