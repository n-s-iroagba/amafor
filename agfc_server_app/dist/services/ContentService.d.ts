import { Article, ArticleCreationAttributes } from '../models';
export declare class ContentService {
    private contentRepository;
    private auditService;
    constructor();
    createArticle(data: ArticleCreationAttributes, authorId: string): Promise<Article>;
    publishArticle(id: string, adminId: string): Promise<Article>;
    getPublicNews(query: any): Promise<Article[]>;
    getArticleDetails(id: string): Promise<Article | null>;
    deleteArticle(id: string, adminId: string): Promise<void>;
}
//# sourceMappingURL=ContentService.d.ts.map