import { 
  UserRepository, 
  DonationRepository, 
  AdCampaignRepository, 
  ArticleRepository,
  PlayerRepository
} from '../repositories';
import { structuredLogger, tracer } from '../utils';

export class AnalyticsService {
  private userRepo: UserRepository;
  private donationRepo: DonationRepository;
  private adRepo: AdCampaignRepository;
  private articleRepo: ArticleRepository;
  private playerRepo: PlayerRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.donationRepo = new DonationRepository();
    this.adRepo = new AdCampaignRepository();
    this.articleRepo = new ArticleRepository();
    this.playerRepo = new PlayerRepository();
  }

  public async getAdminDashboardSummary(): Promise<any> {
    return tracer.startActiveSpan('service.AnalyticsService.getAdminDashboardSummary', async (span) => {
      try {
        // Execute parallel counts for performance
        const [
          totalUsers,
          newUsersToday,
          totalRevenue,
          activeAds,
          totalArticles,
          totalPlayers
        ] = await Promise.all([
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
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to generate dashboard stats', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  private async calculateTotalRevenue(): Promise<number> {
    // Sum Donations + Ad Spend (simplified)
    const donations = await this.donationRepo.sumCompletedAmounts();
    // Assuming Ad Campaigns have a 'budget' or 'spend' field
    const adRevenue = await this.adRepo.sumActiveBudgets(); 
    
    return donations + adRevenue;
  }

  public async getPerformanceMetrics(): Promise<any> {
    // Granular metrics for charts (e.g., traffic over last 7 days)
    // Implementation would involve complex SQL aggregation queries
    return {
      message: "Detailed time-series data implementation pending"
    };
  }
}