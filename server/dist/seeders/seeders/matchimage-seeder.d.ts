import FixtureImage, { FixtureImageAttributes } from '@models/FixtureImage';
import { BaseSeeder } from './base-seeder';
export declare class FixtureImageSeeder extends BaseSeeder<FixtureImage> {
    constructor();
    getData(environment: string): Promise<FixtureImageAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=matchimage-seeder.d.ts.map