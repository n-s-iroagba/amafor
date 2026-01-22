import { Donation } from '@models/Donation';
import { DonationAttributes } from '@models/Donation';
import { BaseSeeder } from './base-seeder';
export declare class DonationSeeder extends BaseSeeder<Donation> {
    constructor();
    getData(environment: string): Promise<DonationAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=donation-seeder.d.ts.map