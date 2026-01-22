import AdCreative, { AdCreativeAttributes } from '@models/AdCreative';
import { BaseSeeder } from './base-seeder';
export declare class AdCreativeSeeder extends BaseSeeder<AdCreative> {
    constructor();
    getData(environment: string): Promise<AdCreativeAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=adcreative-seeder.d.ts.map