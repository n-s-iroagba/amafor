// controllers/FeedsController.ts
import { NextFunction, Request, Response } from 'express';
import { RssFeedSourceService } from '../services/RssFeedSourceService';
import { RssFeedFetcherService } from '@services/RssFeedFetcherService';
import { FeaturedNewsService } from '../services/FeaturedNewsService';



export class FeedsController {
  private rssFeedSourceService: RssFeedSourceService;
  private featuredNewsService: FeaturedNewsService;
  private rssFeedFetcherService: RssFeedFetcherService;

  constructor() {
    this.rssFeedSourceService = new RssFeedSourceService();
    this.featuredNewsService = new FeaturedNewsService();
    this.rssFeedFetcherService = new RssFeedFetcherService();
  }

  /**
   * List feed sources
   * @api GET /feeds
   * @apiName API-FEED-002
   * @apiGroup RSS Feeds
   * @srsRequirement REQ-ADM-07
   */
  getFeedSources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const feedSources = await this.rssFeedSourceService.getAllFeedSources();
      res.json(feedSources);
    } catch (error) {
      next(error)
    }
  };

  /**
   * Add RSS feed source
   * @api POST /feeds
   * @apiName API-FEED-001
   * @apiGroup RSS Feeds
   * @srsRequirement REQ-PUB-04, REQ-ADM-07
   */
  createFeedSource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const feedSource = await this.rssFeedSourceService.createFeedSource(req.body);
      res.status(201).json(feedSource);
    } catch (error) {
      next(error)
    }
  };

  getFeedSource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const feedSource = await this.rssFeedSourceService.getFeedSourceById(id);

      if (!feedSource) {
        res.status(404).json({ error: 'Feed source not found' });
        return;
      }

      res.json(feedSource);
    } catch (error) {
      next(error)
    }
  };

  /**
   * Update feed source
   * @api PUT /feeds/:id
   * @apiName API-FEED-004
   * @apiGroup RSS Feeds
   * @srsRequirement REQ-ADM-07
   */
  updateFeedSource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const feedSource = await this.rssFeedSourceService.updateFeedSource(id, req.body);

      if (!feedSource) {
        res.status(404).json({ error: 'Feed source not found' });
        return;
      }

      res.json(feedSource);
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  /**
   * Delete feed source
   * @api DELETE /feeds/:id
   * @apiName API-FEED-005
   * @apiGroup RSS Feeds
   * @srsRequirement REQ-ADM-07
   */
  deleteFeedSource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.rssFeedSourceService.deleteFeedSource(id);

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