import Lineup, { LineupAttributes } from '@models/Lineup';
import { BaseSeeder } from './base-seeder';
export declare class LineupSeeder extends BaseSeeder<Lineup> {
    constructor();
    getData(environment: string): Promise<LineupAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=lineup-seeder.d.ts.map