import AdZoneModel from '@models/AdZones';
export declare class AdZoneService {
    private adZoneRepository;
    constructor();
    getAllZones(): Promise<AdZoneModel[]>;
    getActiveZones(): Promise<AdZoneModel[]>;
    getZoneStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        averagePrice: number;
    }>;
}
//# sourceMappingURL=AdZoneService.d.ts.map