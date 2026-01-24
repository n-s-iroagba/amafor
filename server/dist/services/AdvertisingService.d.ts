import AdCampaign, { AdCampaignCreationAttributes } from '@models/AdCampaign';
export declare class AdvertisingService {
    private adRepository;
    constructor();
    createCampaign(data: AdCampaignCreationAttributes, advertiserId: string): Promise<AdCampaign>;
    updateCampaign(id: string, updates: Partial<AdCampaignCreationAttributes>): Promise<AdCampaign | null>;
    deleteCampaign(id: string): Promise<boolean>;
    getActiveCampaigns(advertiserId?: string): Promise<AdCampaign[]>;
    getExpiredCampaigns(advertiserId?: string): Promise<AdCampaign[]>;
    getPendingCampaigns(advertiserId?: string): Promise<AdCampaign[]>;
    getAdForZone(zone: string): Promise<AdCampaign | null>;
    trackImpression(id: string): Promise<void>;
    trackClick(id: string): Promise<void>;
    getAdvertiserReports(advertiserId: string): Promise<any>;
}
//# sourceMappingURL=AdvertisingService.d.ts.map