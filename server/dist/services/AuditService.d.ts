import { AuditLogCreationAttributes } from '@models/AuditLog';
export declare class AuditService {
    private auditLogRepository;
    constructor();
    logAction(data: AuditLogCreationAttributes): Promise<void>;
    getEntityHistory(entityType: string, entityId: string, page?: number, limit?: number): Promise<{
        data: import("@models/AuditLog").AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    exportLogs(dateFrom: Date, dateTo: Date, format: 'csv' | 'json'): Promise<any>;
}
//# sourceMappingURL=AuditService.d.ts.map