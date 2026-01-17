import { ArticleFilterOptions, ArticleSortOptions } from '@repositories/ArticleRepository';
import { Article, ArticleTag } from '@models/Article';
export interface PaginatedData<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface HomepageArticles {
    featured: Article[];
    latest: Article[];
    trending: Article[];
    byCategory: Record<string, Article[]>;
}
export declare class ArticleService {
    private articleRepository;
    private readonly CACHE_TTL;
    private readonly HOMEPAGE_CACHE_KEY;
    private readonly PUBLISHED_CACHE_PREFIX;
    constructor();
    fetchHomepageArticles(): Promise<Article[]>;
    fetchAllPublishedArticles(page?: number, limit?: number, filters?: ArticleFilterOptions, sort?: ArticleSortOptions): Promise<PaginatedData<Article>>;
    getArticleById(id: string): Promise<Article | null>;
    invalidateArticleCache(articleId?: string): Promise<void>;
    getArticlesByTag(tag: ArticleTag, page?: number, limit?: number): Promise<PaginatedData<Article>>;
    getArticlesByAuthor(authorId: string, page?: number, limit?: number): Promise<PaginatedData<Article>>;
    searchArticles(query: string, page?: number, limit?: number): Promise<PaginatedData<Article>>;
    private getFromCache;
    private setCache;
    private generatePublishedCacheKey;
    private invalidateHomepageCache;
    warmCache(): Promise<void>;
}
declare const _default: ArticleService;
export default _default;
//# sourceMappingURL=ArticleService.d.ts.map