import { Request, Response } from 'express';
export declare class ArticleController {
    private articleService;
    constructor();
    /**
     * Get homepage articles
     * @api GET /articles/homepage
     * @apiName API-ARTICLE-001
     * @apiGroup Articles
     * @srsRequirement REQ-PUB-03
     */
    fetchHomepageArticles(req: Request, res: Response): Promise<void>;
    /**
     * Get all published articles
     * @api GET /articles/published
     * @apiName API-ARTICLE-002
     * @apiGroup Articles
     * @srsRequirement REQ-PUB-03, REQ-CMS-01
     */
    fetchAllPublishedArticles(req: Request, res: Response): Promise<void>;
    /**
     * Get article by ID
     * @api GET /articles/:id
     * @apiName API-ARTICLE-006
     * @apiGroup Articles
     * @srsRequirement REQ-PUB-03, REQ-CMS-01
     */
    getArticleById(req: Request, res: Response): Promise<void>;
    /**
     * Get articles by tag
     * @api GET /articles/tag/:tag
     * @apiName API-ARTICLE-003
     * @apiGroup Articles
     * @srsRequirement REQ-PUB-03
     */
    getArticlesByTag(req: Request, res: Response): Promise<void>;
    /**
     * Search articles
     * @api GET /articles/search
     * @apiName API-ARTICLE-004
     * @apiGroup Articles
     * @srsRequirement REQ-PUB-03
     */
    searchArticles(req: Request, res: Response): Promise<void>;
    invalidateCache(req: Request, res: Response): Promise<void>;
    /**
     * Get popular tags
     * @api GET /articles/popular-tags
     * @apiName API-ARTICLE-005
     * @apiGroup Articles
     * @srsRequirement REQ-PUB-03
     */
    getPopularTags(req: Request, res: Response): Promise<void>;
    /**
     * Create new article
     * @api POST /articles
     * @apiName API-ARTICLE-007
     */
    createArticle(req: Request, res: Response): Promise<void>;
    /**
   * Update article
   * @api PATCH /articles/:id
   * @apiName API-ARTICLE-008
   */
    updateArticle(req: Request, res: Response): Promise<void>;
    /**
   * Delete article
   * @api DELETE /articles/:id
   * @apiName API-ARTICLE-009
   */
    deleteArticle(req: Request, res: Response): Promise<void>;
    /**
     * Get article analytics
     * @api GET /articles/analytics
     * @apiName API-ARTICLE-010
     */
    getAnalytics(req: Request, res: Response): Promise<void>;
}
declare const _default: ArticleController;
export default _default;
//# sourceMappingURL=ArticleController.d.ts.map