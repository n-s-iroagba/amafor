"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const services_1 = require("../services");
class AnalyticsController {
    constructor() {
        /**
         * Get admin dashboard analytics
         * @api GET /analytics/dashboard
         * @apiName API-ANALYTICS-001
         * @apiGroup Analytics
         * @srsRequirement REQ-ANALYTICS-01
         */
        this.getAdminDashboard = async (req, res, next) => {
            try {
                const stats = await this.analyticsService.getAdminDashboardSummary();
                res.status(200).json({
                    success: true,
                    data: stats
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.analyticsService = new services_1.AnalyticsService();
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=AnalyticsController.js.map