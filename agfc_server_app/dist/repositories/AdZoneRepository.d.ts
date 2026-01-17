import { AdZone } from '@models/AdCampaign';
import AdZoneModel, { AdZoneAttributes, AdZoneStatus } from '@models/AdZones';
import { BaseRepository } from './BaseRepository';
export interface IAdZoneRepository {
    findById(id: string): Promise<AdZoneModel | null>;
    findAll(): Promise<AdZoneModel[]>;
    findByZone(zone: AdZone): Promise<AdZoneModel | null>;
    findActiveZones(): Promise<AdZoneModel[]>;
    findByType(type: string): Promise<AdZoneModel[]>;
    updatePrice(zone: AdZone, pricePerView: number): Promise<boolean>;
    getZonePrice(zone: AdZone): Promise<number | null>;
    getAvailableZonesForBudget(budget: number, impressions: number): Promise<AdZoneModel[]>;
    updateStatus(zone: AdZone, status: string): Promise<boolean>;
    getZoneStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        averagePrice: number;
    }>;
}
export declare class AdZoneRepository extends BaseRepository<AdZoneModel> implements IAdZoneRepository {
    constructor();
    findByZone(zone: AdZone): Promise<AdZoneModel | null>;
    findActiveZones(): Promise<AdZoneModel[]>;
    findByType(type: string): Promise<AdZoneModel[]>;
    updatePrice(zone: AdZone, pricePerView: number): Promise<boolean>;
    getZonePrice(zone: AdZone): Promise<number | null>;
    getAvailableZonesForBudget(budget: number, impressions: number): Promise<AdZoneModel[]>;
    updateStatus(zone: AdZone, status: AdZoneStatus): Promise<boolean>;
    getZoneStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        averagePrice: number;
    }>;
    update(zone: AdZone, data: Partial<AdZoneAttributes>, options?: any): Promise<[number, AdZoneModel[]]>;
}
//# sourceMappingURL=AdZoneRepository.d.ts.map