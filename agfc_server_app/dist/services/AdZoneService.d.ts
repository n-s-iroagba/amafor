import { AdZone } from '@models/AdCampaign';
import { AdZoneAttributes } from '@models/AdZones';
import { IAdZoneRepository } from '@repositories/AdZoneRepository';
export interface ZonePriceUpdateData {
    zone: AdZone;
    pricePerView: number;
    updatedBy: string;
}
export interface ZoneAvailabilityCheck {
    zone: AdZone;
    budget: number;
    impressions: number;
}
export interface ZoneSelectionResult {
    zone: AdZoneAttributes;
    totalCost: number;
    costPerImpression: number;
    fitsBudget: boolean;
}
export declare class AdZoneService {
    private repository;
    constructor(repository?: IAdZoneRepository);
    getAllZones(): Promise<AdZoneAttributes[]>;
    getZoneByType(zone: AdZone): Promise<AdZoneAttributes>;
    getActiveZones(): Promise<AdZoneAttributes[]>;
    updateZonePrice(data: ZonePriceUpdateData): Promise<AdZoneAttributes>;
    calculateCampaignCost(zone: AdZone, impressions: number): Promise<{
        totalCost: number;
        costPerImpression: number;
        formattedCost: string;
    }>;
    checkZoneAvailability(data: ZoneAvailabilityCheck): Promise<ZoneSelectionResult>;
    getBestZoneForBudget(budget: number, impressions: number): Promise<ZoneSelectionResult | null>;
    getZoneStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        averagePrice: number;
        zones: AdZoneAttributes[];
    }>;
    validateZoneForCampaign(zone: AdZone, adDimensions: string): Promise<{
        isValid: boolean;
        message?: string;
        zoneDetails?: AdZoneAttributes;
    }>;
}
//# sourceMappingURL=AdZoneService.d.ts.map