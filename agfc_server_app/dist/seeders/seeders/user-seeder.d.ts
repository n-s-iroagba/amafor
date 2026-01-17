import { User } from '@models/User';
import { UserAttributes } from '@models/User';
import { BaseSeeder } from './base-seeder';
export declare class UserSeeder extends BaseSeeder<User> {
    constructor();
    getData(environment: string): Promise<UserAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=user-seeder.d.ts.map