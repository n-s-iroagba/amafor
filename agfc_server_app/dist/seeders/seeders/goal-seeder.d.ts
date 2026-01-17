import Goal, { GoalAttributes } from '@models/Goal';
import { BaseSeeder } from './base-seeder';
export declare class GoalSeeder extends BaseSeeder<Goal> {
    constructor();
    getData(environment: string): Promise<GoalAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=goal-seeder.d.ts.map