import { AuditLog } from '@models/AuditLog';
import { AuditLogAttributes } from '@models/AuditLog';
import { BaseSeeder } from './base-seeder';
export declare class AuditLogSeeder extends BaseSeeder<AuditLog> {
    constructor();
    getData(environment: string): Promise<AuditLogAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=auditlog-seeder.d.ts.map