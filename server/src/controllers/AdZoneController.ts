import { Request, Response, NextFunction } from 'express';
import { AdZoneService } from '../services/AdZoneService';
import logger from '../utils/logger';
import tracer from '../utils/tracer';

export class AdZoneController {
  private adZoneService: AdZoneService;

  constructor() {
    this.adZoneService = new AdZoneService();
  }

  /**
   * Get all Zones
   * @api GET /ads/zones
   */
  public getAllZones = async (req: Request, res: Response, next: NextFunction) => {
    return tracer.startActiveSpan('controller.AdZoneController.getAllZones', async (span) => {
      try {
        const zones = await this.adZoneService.getAllZones();
        res.status(200).json({ success: true, data: zones });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        next(error);
      } finally {
        span.end();
      }
    });
  };

  /**
   * Get Active Zones
   * @api GET /ads/zones/active
   */
  public getActiveZones = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const zones = await this.adZoneService.getActiveZones();
      res.status(200).json({ success: true, data: zones });
    } catch (error: any) {
      next(error);
    }
  };
}