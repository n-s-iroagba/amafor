// controllers/FeedsController.ts
import { NextFunction, Request, Response } from 'express';
import { RssFeedSourceService } from '../services/RssFeedSourceService';
import { ThirdPartyArticleService } from '../services/ThirdPartyArticleService';
import { RssFeedFetcherService } from '../services/RssFeedFetcherService';
import { ThirdPartyArticleQuerySchema } from '../validations/rssFeed.schema';


export class FeedsController {
  private rssFeedSourceService: RssFeedSourceService;
  private thirdPartyArticleService: ThirdPartyArticleService;
  private rssFeedFetcherService: RssFeedFetcherService;

  constructor() {
    this.rssFeedSourceService = new RssFeedSourceService();
    this.thirdPartyArticleService = new ThirdPartyArticleService();
    this.rssFeedFetcherService = new RssFeedFetcherService();
  }

  // Feed Source methods
  getFeedSources = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const feedSources = await this.rssFeedSourceService.getAllFeedSources();
      res.json(feedSources);
    } catch (error) {
     next(error)
    }
  };

  createFeedSource = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
     
      const feedSource = await this.rssFeedSourceService.createFeedSource(req.body);
      res.status(201).json(feedSource);
    } catch (error) {
      next(error)
    }
  };

  getFeedSource = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const feedSource = await this.rssFeedSourceService.getFeedSourceById(parseInt(id));
      
      if (!feedSource) {
        res.status(404).json({ error: 'Feed source not found' });
        return;
      }
      
      res.json(feedSource);
    } catch (error) {
     next(error)
    }
  };

  updateFeedSource = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
     
      const feedSource = await this.rssFeedSourceService.updateFeedSource(parseInt(id), req.body);
      
      if (!feedSource) {
        res.status(404).json({ error: 'Feed source not found' });
        return;
      }
      
      res.json(feedSource);
    } catch (error) {
      res.status(400).json({ error});
    }
  };

  deleteFeedSource = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.rssFeedSourceService.deleteFeedSource(parseInt(id));
      
      if (!success) {
        res.status(404).json({ error: 'Feed source not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
     next(error)
    }
  };








}