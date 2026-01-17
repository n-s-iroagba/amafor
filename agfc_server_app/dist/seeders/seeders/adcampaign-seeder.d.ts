import { AdCampaign } from '@models/AdCampaign';
import { AdCampaignAttributes } from '@models/AdCampaign';
import { BaseSeeder } from './base-seeder';
export declare class AdCampaignSeeder extends BaseSeeder<AdCampaign> {
    constructor();
    getData(environment: string): Promise<AdCampaignAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=adcampaign-seeder.d.ts.map