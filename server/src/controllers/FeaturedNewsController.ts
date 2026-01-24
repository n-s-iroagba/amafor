import { NextFunction, Request, Response } from 'express';
import featuredNewsService from '../services/FeaturedNewsService';

export class FeaturedNewsController {

    /**
     * Get homepage featured news
     * @api GET /featured-news/homepage
     */
    async getHomepageNews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const news = await featuredNewsService.fetchHomepageFeaturedNews();
            res.status(200).json({
                success: true,
                data: news
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * List all news with pagination
     * @api GET /featured-news
     */
    async listNews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await featuredNewsService.getAllNews(page, limit, req.query);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}