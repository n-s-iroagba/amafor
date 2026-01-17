import AdCreative from "@models/AdCreative";
export declare class AdCreativeService {
    private adCreativeRepository;
    private subscriptionService;
    constructor();
    getAllAdCreatives(): Promise<AdCreative[]>;
    getAdCreativeById(id: number): Promise<AdCreative | null>;
    getAdCreativesBySubscription(subscriptionId: number): Promise<AdCreative[]>;
    getActiveAdCreatives(): Promise<AdCreative[]>;
    createAdCreative(adCreativeData: Partial<AdCreative>): Promise<AdCreative>;
    updateAdCreative(id: number, adCreativeData: Partial<AdCreative>): Promise<AdCreative | null>;
    deleteAdCreative(id: number): Promise<boolean>;
    getAdCreativeForZone(zoneIdentifier: string): Promise<AdCreative | null>;
}
//# sourceMappingURL=AdCreativeService.d.ts.map