"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
class AuditService {
    constructor() {
        this.auditLogRepository = new repositories_1.AuditLogRepository();
    }
    async logAction(data) {
        return utils_1.tracer.startActiveSpan('service.AuditService.logAction', async (span) => {
            try {
                // 1. Write to Database for admin dashboard retrieval
                await this.auditLogRepository.logAction(data);
                // 2. Write to Log File via winston for redundancy/security ops
                utils_1.structuredLogger.audit(data.action, data.userId || 'system', data.entityType, data.entityId || 'unknown', {
                    details: data,
                    ip: data.ipAddress,
                    metadata: data.metadata
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                // Fallback: If DB fails, ensure we still have a file log
                utils_1.structuredLogger.error('CRITICAL: Failed to write to Audit Log DB', { error: error.message, data });
            }
            finally {
                span.end();
            }
        });
    }
    async getEntityHistory(entityType, entityId, page = 1, limit = 20) {
        return utils_1.tracer.startActiveSpan('service.AuditService.getEntityHistory', async (span) => {
            try {
                return await this.auditLogRepository.findByEntity(entityType, entityId, { page, limit });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to fetch entity history', { error: error.message, entityType, entityId });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async exportLogs(dateFrom, dateTo, format) {
        return utils_1.tracer.startActiveSpan('service.AuditService.exportLogs', async (span) => {
            try {
                return await this.auditLogRepository.exportLogs(dateFrom, dateTo, format);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to export logs', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=AuditService.js.map