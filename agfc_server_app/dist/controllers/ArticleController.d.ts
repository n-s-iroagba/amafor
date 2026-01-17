import { Request, Response } from 'express';
export declare class ArticleController {
    private articleService;
    constructor();
    fetchHomepageArticles(req: Request, res: Response): Promise<void>;
    fetchAllPublishedArticles(req: Request, res: Response): Promise<void>;
    getArticleById(req: Request, res: Response): Promise<void>;
    getArticlesByTag(req: Request, res: Response): Promise<void>;
    searchArticles(req: Request, res: Response): Promise<void>;
    invalidateCache(req: Request, res: Response): Promise<void>;
    getPopularTags(req: Request, res: Response): Promise<void>;
}
declare const _default: ArticleController;
export default _default;
//# sourceMappingURL=ArticleController.d.ts.map