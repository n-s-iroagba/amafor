import { BaseRepository } from './BaseRepository';
import { RssFeedSource } from '@models/RssFeedSource';
export interface RssFeedFilterOptions {
    search?: string;
    isActive?: boolean;
    category?: string;
    fetchStatus?: string;
}
export interface RssFeedSortOptions {
    sortBy?: 'name' | 'feedUrl' | 'lastFetchedAt' | 'createdAt' | 'updateFrequency';
    sortOrder?: 'asc' | 'desc';
}
export declare class RssFeedSourceRepository extends BaseRepository<RssFeedSource> {
    private auditLogRepository;
    constructor();
    searchFeeds(search: string, filters?: Omit<RssFeedFilterOptions, 'search'>, sort?: RssFeedSortOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: RssFeedSource[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateFetchStatus(id: string, status: string, lastError?: string): Promise<void>;
    getFeedsNeedingUpdate(thresholdMinutes?: number): Promise<RssFeedSource[]>;
}
//# sourceMappingURL=RssFeedSourceRepository.d.ts.map