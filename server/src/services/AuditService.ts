import { AuditLogCreationAttributes, EntityType } from '@models/AuditLog';
import { AuditLogRepository } from '../repositories';

import { structuredLogger, tracer } from '../utils';

export class AuditService {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.auditLogRepository = new AuditLogRepository();
  }

  public async logAction(data: AuditLogCreationAttributes): Promise<void> {
    return tracer.startActiveSpan('service.AuditService.logAction', async (span) => {
      try {
        // 1. Write to Database for admin dashboard retrieval
        await this.auditLogRepository.logAction(data);

        // 2. Write to Log File via winston for redundancy/security ops
        structuredLogger.audit(
          data.action,
          data.userId || 'system',
          data.entityType,
          data.entityId || 'unknown',
          {
            details: data,
            ip: data.ipAddress,
            metadata: data.metadata
          }
        );

      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        // Fallback: If DB fails, ensure we still have a file log
        structuredLogger.error('CRITICAL: Failed to write to Audit Log DB', { error: error.message, data });
      } finally {
        span.end();
      }
    });
  }

  public async getEntityHistory(entityType: string, entityId: string, page: number = 1, limit: number = 20) {
    return tracer.startActiveSpan('service.AuditService.getEntityHistory', async (span) => {
      try {
        return await this.auditLogRepository.findByEntity(entityType as EntityType, entityId, { page, limit });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to fetch entity history', { error: error.message, entityType, entityId });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async exportLogs(dateFrom: Date, dateTo: Date, format: 'csv' | 'json'): Promise<any> {
    return tracer.startActiveSpan('service.AuditService.exportLogs', async (span) => {
      try {
        return await this.auditLogRepository.exportLogs(dateFrom, dateTo, format);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to export logs', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}