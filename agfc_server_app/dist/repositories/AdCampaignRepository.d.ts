import { AdCampaign, AdCampaignAttributes, AdCampaignCreationAttributes, CampaignStatus, AdZone, PaymentStatus } from '@models/AdCampaign';
import { BaseRepository } from './BaseRepository';
export interface AdCampaignFilterOptions {
    status?: CampaignStatus;
    advertiserId?: string;
    zone?: AdZone;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
}
export declare class AdCampaignRepository extends BaseRepository<AdCampaign> {
    private auditLogRepository;
    constructor();
    findActive(zone: string): Promise<AdCampaign[]>;
    incrementImpressions(id: string): Promise<void>;
    incrementClicks(id: string): Promise<void>;
    sumActiveBudgets(): Promise<number>;
    createWithAudit(data: AdCampaignCreationAttributes, auditData: any): Promise<AdCampaign>;
    updateWithAudit(id: string, data: Partial<AdCampaignAttributes>, auditData: any): Promise<AdCampaign | null>;
    findByAdvertiser(advertiserId: string, filters?: AdCampaignFilterOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: AdCampaign[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByStatus(status: CampaignStatus, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: AdCampaign[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paymentReference: string, auditData: any): Promise<AdCampaign | null>;
    pauseCampaign(id: string, auditData: any): Promise<AdCampaign | null>;
    resumeCampaign(id: string, auditData: any): Promise<AdCampaign | null>;
    incrementViews(id: string, uniqueViews?: number): Promise<void>;
    getPerformanceMetrics(id: string, startDate?: Date, endDate?: Date): Promise<{
        campaignId: string;
        viewsDelivered: number;
        uniqueViews: number;
        totalImpressions: number;
        clickThroughRate: number;
        cpv: number;
        totalSpent: number;
        remainingBudget: number;
        deliveryRate: number;
        estimatedCompletion?: Date;
    }>;
    getCampaignsForAdPlacement(zone: AdZone, tags?: string[]): Promise<AdCampaign[]>;
    checkAndPauseCompletedCampaigns(): Promise<number>;
    getAdvertisingAnalytics(dateFrom: Date, dateTo: Date): Promise<{
        totalRevenue: number;
        activeCampaigns: number;
        completedCampaigns: number;
        totalViewsDelivered: number;
        totalUniqueViews: number;
        averageCPV: number;
        topPerformingZones: any[];
        revenueByDay: any[];
    }>;
    private generateRevenueByDay;
    private daysBetween;
    exportCampaignData(id: string, format?: 'csv' | 'json'): Promise<any>;
}
//# sourceMappingURL=AdCampaignRepository.d.ts.map