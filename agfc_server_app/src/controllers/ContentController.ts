import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services';

export class ContentController {
  private contentService: ContentService;

  constructor() {
    this.contentService = new ContentService();
  }

  public createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = (req as any).user.id;
      const article = await this.contentService.createArticle(req.body, authorId);
      
      res.status(201).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  };

  public publishArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = (req as any).user.id;
      const article = await this.contentService.publishArticle(id, adminId);

      res.status(200).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  };

  public getPublicNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.contentService.getPublicNews(req.query);
      res.status(200).json({ success: true, data: news });
    } catch (error) {
      next(error);
    }
  };

  public getArticleDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const article = await this.contentService.getArticleDetails(id);
      
      if (!article) throw new Error('Article not found');

      res.status(200).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  };

  public deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = (req as any).user.id;
      await this.contentService.deleteArticle(id, adminId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}