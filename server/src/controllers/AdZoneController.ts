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

  /**
   * Update Zone per-view rate
   * @api POST /ads/zones
   */
  public updateZonePrice = async (req: Request, res: Response, next: NextFunction) => {
    return tracer.startActiveSpan('controller.AdZoneController.updateZonePrice', async (span) => {
      try {
        const { zoneId, perViewRate } = req.body;
        if (!zoneId || perViewRate === undefined) {
          return res.status(400).json({ success: false, message: 'zoneId and perViewRate are required' });
        }

        const success = await this.adZoneService.updateZonePrice(zoneId, perViewRate);
        if (!success) {
          return res.status(404).json({ success: false, message: 'Ad zone not found or update failed' });
        }

        res.status(200).json({ success: true, message: 'Ad zone rate updated successfully' });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        next(error);
      } finally {
        span.end();
      }
    });
  };
}