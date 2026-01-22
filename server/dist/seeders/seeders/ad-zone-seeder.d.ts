import { CreationAttributes } from 'sequelize';
import { AdZone } from '@models/AdCampaign';
import AdZoneModel from '@models/AdZones';
import { BaseSeeder } from './base-seeder';
export declare class AdZoneSeeder extends BaseSeeder<AdZoneModel> {
    constructor();
    getData(environment: string): Promise<CreationAttributes<AdZoneModel>[]>;
    private getPredefinedZones;
    seed(options?: any): Promise<number>;
    clear(transaction?: any): Promise<number>;
    updateZonePrices(newPrices: Record<AdZone, number>): Promise<number>;
    resetToDefaultPrices(): Promise<number>;
}
//# sourceMappingURL=ad-zone-seeder.d.ts.map