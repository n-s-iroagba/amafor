import { RssFeedSource } from '@models/RssFeedSource';
import { RssFeedSourceAttributes } from '@models/RssFeedSource';
import { BaseSeeder } from './base-seeder';
export declare class RssFeedSourceSeeder extends BaseSeeder<RssFeedSource> {
    constructor();
    getData(environment: string): Promise<RssFeedSourceAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=rssfeedsource-seeder.d.ts.map