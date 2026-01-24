import { NextFunction, Request, Response } from 'express';
export declare class FeaturedNewsController {
    /**
     * Get homepage featured news
     * @api GET /featured-news/homepage
     */
    getHomepageNews(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * List all news with pagination
     * @api GET /featured-news
     */
    listNews(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=FeaturedNewsController.d.ts.map