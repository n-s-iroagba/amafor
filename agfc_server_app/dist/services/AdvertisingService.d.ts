import { AdCampaign, AdCampaignCreationAttributes } from '../models';
export declare class AdvertisingService {
    private adRepository;
    constructor();
    createCampaign(data: AdCampaignCreationAttributes, advertiserId: string): Promise<AdCampaign>;
    activateCampaign(campaignId: string): Promise<AdCampaign>;
    getAdForZone(zone: string): Promise<AdCampaign | null>;
    trackImpression(campaignId: string): Promise<void>;
    trackClick(campaignId: string): Promise<void>;
}
//# sourceMappingURL=AdvertisingService.d.ts.map