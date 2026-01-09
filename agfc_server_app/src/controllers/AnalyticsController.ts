import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  public getAdminDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.analyticsService.getAdminDashboardSummary();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
}