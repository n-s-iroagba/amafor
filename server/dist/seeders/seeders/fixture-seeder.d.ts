import { Fixture } from '@models/Fixture';
import { FixtureAttributes } from '@models/Fixture';
import { BaseSeeder } from './base-seeder';
export declare class FixtureSeeder extends BaseSeeder<Fixture> {
    constructor();
    getData(environment: string): Promise<FixtureAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=fixture-seeder.d.ts.map