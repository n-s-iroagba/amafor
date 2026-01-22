import { SystemNotification } from '@models/SystemNotification';
import { SystemNotificationAttributes } from '@models/SystemNotification';
import { BaseSeeder } from './base-seeder';
export declare class SystemNotificationSeeder extends BaseSeeder<SystemNotification> {
    constructor();
    getData(environment: string): Promise<SystemNotificationAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=systemnotification-seeder.d.ts.map