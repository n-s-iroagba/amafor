import { PatronSubscription } from '@models/PatronSubscription';
import { PatronSubscriptionAttributes } from '@models/PatronSubscription';
import { BaseSeeder } from './base-seeder';
export declare class PatronSubscriptionSeeder extends BaseSeeder<PatronSubscription> {
    constructor();
    getData(environment: string): Promise<PatronSubscriptionAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=patronsubscription-seeder.d.ts.map