import { FeaturedNews, FeaturedNewsCreationAttributes } from '../models/FeaturedNews';
import { BaseRepository } from './BaseRepository';
export declare class FeaturedNewsRepository extends BaseRepository<FeaturedNews> {
    constructor();
    createOrUpdateNews(data: FeaturedNewsCreationAttributes): Promise<{
        article: FeaturedNews;
        created: boolean;
    }>;
    findBySourceId(rssFeedSourceId: number): Promise<FeaturedNews[]>;
    findRecentNews(limit?: number): Promise<FeaturedNews[]>;
}
//# sourceMappingURL=FeaturedNewsRepository.d.ts.map