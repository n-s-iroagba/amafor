import Coach, { CoachAttributes } from '@models/Coach';
import { BaseSeeder } from './base-seeder';
export declare class CoachSeeder extends BaseSeeder<Coach> {
    constructor();
    getData(environment: string): Promise<CoachAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=coach-seeder.d.ts.map