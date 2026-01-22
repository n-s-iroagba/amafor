import { AuditLog, AuditLogCreationAttributes, AuditAction, EntityType } from '@models/AuditLog';
import { BaseRepository } from './BaseRepository';
export interface AuditLogFilterOptions {
    entityType?: EntityType;
    entityId?: string;
    userId?: string;
    action?: AuditAction;
    dateFrom?: Date;
    dateTo?: Date;
    ipAddress?: string;
}
export declare class AuditLogRepository extends BaseRepository<AuditLog> {
    constructor();
    findByEntity(entityType: EntityType, entityId: string, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByUser(userId: string, filters?: AuditLogFilterOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByFilters(filters: AuditLogFilterOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    exportLogs(dateFrom: Date, dateTo: Date, format?: 'csv' | 'json'): Promise<any[]>;
    logAction(data: AuditLogCreationAttributes): Promise<AuditLog>;
    getSystemActivityStats(period?: 'day' | 'week' | 'month'): Promise<{
        totalActions: number;
        byAction: Record<string, number>;
        byEntity: Record<string, number>;
        byUserType: Record<string, number>;
        topUsers: any[];
    }>;
    cleanupOldLogs(retentionDays?: number): Promise<number>;
}
//# sourceMappingURL=AuditLogRepository.d.ts.map