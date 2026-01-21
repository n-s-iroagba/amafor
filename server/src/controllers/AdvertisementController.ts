import { Request, Response, NextFunction } from 'express';
import { AdvertisingService } from '../services';

export class AdvertisingController {
  private adService: AdvertisingService;

  constructor() {
    this.adService = new AdvertisingService();
  }

  // Admin Only
  public createCampaign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creatorId = (req as any).user.id;
      const campaign = await this.adService.createCampaign(req.body, creatorId);
      
      res.status(201).json({ success: true, data: campaign });
    } catch (error) {
      next(error);
    }
  };

  // Public (High Traffic)
  public getAdForZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { zone } = req.params;
      const ad = await this.adService.getAdForZone(zone);

      if (!ad) {
        // 204 No Content is appropriate if no ad is available to serve
        res.status(204).send(); 
        return; 
      }

      res.status(200).json({ success: true, data: ad });
    } catch (error) {
      next(error);
    }
  };

  // Public (Tracking Pixel / Redirect)
  public trackClick = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.adService.trackClick(id);

      // If a destination URL is provided in query, redirect user there
      const redirectUrl = req.query.url as string;
      if (redirectUrl) {
        res.redirect(redirectUrl);
      } else {
        res.status(200).json({ success: true, message: 'Click tracked' });
      }
    } catch (error) {
      next(error);
    }
  };
}