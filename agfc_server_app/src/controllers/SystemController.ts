import { Request, Response, NextFunction } from 'express';
import { SystemService } from '../services';

export class SystemController {
  private systemService: SystemService;

  constructor() {
    this.systemService = new SystemService();
  }

  public getHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await this.systemService.getHealthStatus();
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  };

  public getCookieConsent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await this.systemService.getCookieConsentConfig();
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  };
}