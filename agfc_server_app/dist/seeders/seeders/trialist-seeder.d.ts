import { Trialist } from '@models/Trialist';
import { TrialistAttributes } from '@models/Trialist';
import { BaseSeeder } from './base-seeder';
export declare class TrialistSeeder extends BaseSeeder<Trialist> {
    constructor();
    getData(environment: string): Promise<TrialistAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=trialist-seeder.d.ts.map