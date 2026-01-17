"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
class AnalyticsService {
    constructor() {
        this.userRepo = new repositories_1.UserRepository();
        this.donationRepo = new repositories_1.DonationRepository();
        this.adRepo = new repositories_1.AdCampaignRepository();
        this.articleRepo = new repositories_1.ArticleRepository();
        this.playerRepo = new repositories_1.PlayerRepository();
    }
    async getAdminDashboardSummary() {
        return utils_1.tracer.startActiveSpan('service.AnalyticsService.getAdminDashboardSummary', async (span) => {
            try {
                // Execute parallel counts for performance
                const [totalUsers, newUsersToday, totalRevenue, activeAds, totalArticles, totalPlayers] = await Promise.all([
                    this.userRepo.count(),
                    this.userRepo.countNewToday(),
                    this.calculateTotalRevenue(),
                    this.adRepo.count({ where: { status: 'ACTIVE' } }),
                    this.articleRepo.count({ where: { status: 'PUBLISHED' } }),
                    this.playerRepo.count()
                ]);
                const summary = {
                    users: { total: totalUsers, newToday: newUsersToday },
                    content: { articles: totalArticles, players: totalPlayers },
                    commercial: { activeCampaigns: activeAds, revenue: totalRevenue },
                    timestamp: new Date()
                };
                return summary;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to generate dashboard stats', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async calculateTotalRevenue() {
        // Sum Donations + Ad Spend (simplified)
        const donations = await this.donationRepo.sumCompletedAmounts();
        // Assuming Ad Campaigns have a 'budget' or 'spend' field
        const adRevenue = await this.adRepo.sumActiveBudgets();
        return donations + adRevenue;
    }
    async getPerformanceMetrics() {
        // Granular metrics for charts (e.g., traffic over last 7 days)
        // Implementation would involve complex SQL aggregation queries
        return {
            message: "Detailed time-series data implementation pending"
        };
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=AnalyticsService.js.map