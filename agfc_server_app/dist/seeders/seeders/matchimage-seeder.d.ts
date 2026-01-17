import MatchImage, { MatchImageAttributes } from '@models/MatchImage';
import { BaseSeeder } from './base-seeder';
export declare class MatchImageSeeder extends BaseSeeder<MatchImage> {
    constructor();
    getData(environment: string): Promise<MatchImageAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=matchimage-seeder.d.ts.map