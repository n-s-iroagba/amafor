import AdCreative, { AdCreativeCreationAttributes } from "@models/AdCreative";
export declare class AdCreativeService {
    private adCreativeRepository;
    constructor();
    getAllAdCreatives(): Promise<AdCreative[]>;
    getAdCreativeById(id: string): Promise<AdCreative | null>;
    getAdCreativesByCampaign(campaignId: string): Promise<AdCreative[]>;
    getActiveAdCreatives(): Promise<AdCreative[]>;
    createAdCreative(adCreativeData: AdCreativeCreationAttributes): Promise<AdCreative>;
    updateAdCreative(id: string, adCreativeData: Partial<AdCreative>): Promise<AdCreative | null>;
    deleteAdCreative(id: string): Promise<boolean>;
    incrementAdViews(id: string): Promise<void>;
}
//# sourceMappingURL=AdCreativeService.d.ts.map