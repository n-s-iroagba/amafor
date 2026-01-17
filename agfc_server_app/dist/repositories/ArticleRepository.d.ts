import { Article, ArticleAttributes, ArticleCreationAttributes, ArticleStatus, ArticleTag } from '@models/Article';
import { BaseRepository } from './BaseRepository';
export interface ArticleFilterOptions {
    tag?: ArticleTag;
    author?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    status?: ArticleStatus;
}
export interface ArticleSortOptions {
    sortBy?: 'publishedAt' | 'updatedAt' | 'views' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export declare class ArticleRepository extends BaseRepository<Article> {
    private auditLogRepository;
    constructor();
    createWithAudit(data: ArticleCreationAttributes, auditData: any): Promise<Article>;
    updateWithAudit(id: string, data: Partial<ArticleAttributes>, auditData: any): Promise<Article | null>;
    publish(id: string, auditData: any, publishAt?: Date): Promise<Article | null>;
    unpublish(id: string, auditData: any): Promise<Article | null>;
    incrementViewCount(id: string): Promise<void>;
    findPublished(filters?: ArticleFilterOptions, sort?: ArticleSortOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: Article[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findDrafts(pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: Article[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findScheduled(): Promise<Article[]>;
    processScheduledArticles(): Promise<void>;
    getTopArticles(limit?: number, period?: 'day' | 'week' | 'month' | 'all'): Promise<Article[]>;
    getAnalytics(dateFrom: Date, dateTo: Date): Promise<{
        totalViews: number;
        uniqueVisitors: number;
        averageTimeOnPage: number;
        bounceRate: number;
        topArticles: any[];
        viewsByDay: any[];
    }>;
    private calculateReadTime;
    private generateViewsByDay;
}
//# sourceMappingURL=ArticleRepository.d.ts.map