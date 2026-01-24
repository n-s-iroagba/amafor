import { Request, Response, NextFunction } from 'express';
export declare class AnalyticsController {
    private analyticsService;
    constructor();
    /**
     * Get admin dashboard analytics
     * @api GET /analytics/dashboard
     * @apiName API-ANALYTICS-001
     * @apiGroup Analytics
     * @srsRequirement REQ-ANALYTICS-01
     */
    getDashboardStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRevenueStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AnalyticsController.d.ts.map