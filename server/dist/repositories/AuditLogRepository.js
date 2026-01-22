"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const sequelize_1 = require("sequelize");
const AuditLog_1 = require("@models/AuditLog");
const BaseRepository_1 = require("./BaseRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
class AuditLogRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(AuditLog_1.AuditLog);
    }
    async findByEntity(entityType, entityId, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.AuditLog.findByEntity', async (span) => {
            try {
                span.setAttributes({
                    entityType,
                    entityId
                });
                const options = {
                    where: { entityType, entityId },
                    order: [['timestamp', 'DESC']],
                    include: ['user']
                };
                if (pagination) {
                    return await this.paginate(pagination.page, pagination.limit, options);
                }
                else {
                    const data = await this.findAll(options);
                    const total = await this.count({ where: { entityType, entityId } });
                    return {
                        data,
                        total,
                        page: 1,
                        totalPages: 1
                    };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding audit logs by entity', { error, entityType, entityId });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findByUser(userId, filters = {}, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.AuditLog.findByUser', async (span) => {
            try {
                span.setAttribute('userId', userId);
                const where = { userId };
                // Apply filters
                if (filters.entityType) {
                    where.entityType = filters.entityType;
                }
                if (filters.entityId) {
                    where.entityId = filters.entityId;
                }
                if (filters.action) {
                    where.action = filters.action;
                }
                if (filters.dateFrom || filters.dateTo) {
                    where.timestamp = {};
                    if (filters.dateFrom) {
                        where.timestamp[sequelize_1.Op.gte] = filters.dateFrom;
                    }
                    if (filters.dateTo) {
                        where.timestamp[sequelize_1.Op.lte] = filters.dateTo;
                    }
                }
                if (filters.ipAddress) {
                    where.ipAddress = filters.ipAddress;
                }
                const options = {
                    where,
                    order: [['timestamp', 'DESC']]
                };
                if (pagination) {
                    return await this.paginate(pagination.page, pagination.limit, options);
                }
                else {
                    const data = await this.findAll(options);
                    const total = await this.count({ where });
                    return {
                        data,
                        total,
                        page: 1,
                        totalPages: 1
                    };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding audit logs by user', { error, userId, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findByFilters(filters, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.AuditLog.findByFilters', async (span) => {
            try {
                span.setAttribute('filters', JSON.stringify(filters));
                const where = {};
                // Apply filters
                if (filters.entityType) {
                    where.entityType = filters.entityType;
                }
                if (filters.entityId) {
                    where.entityId = filters.entityId;
                }
                if (filters.userId) {
                    where.userId = filters.userId;
                }
                if (filters.action) {
                    where.action = filters.action;
                }
                if (filters.dateFrom || filters.dateTo) {
                    where.timestamp = {};
                    if (filters.dateFrom) {
                        where.timestamp[sequelize_1.Op.gte] = filters.dateFrom;
                    }
                    if (filters.dateTo) {
                        where.timestamp[sequelize_1.Op.lte] = filters.dateTo;
                    }
                }
                if (filters.ipAddress) {
                    where.ipAddress = filters.ipAddress;
                }
                const options = {
                    where,
                    order: [['timestamp', 'DESC']],
                    include: ['user']
                };
                if (pagination) {
                    return await this.paginate(pagination.page, pagination.limit, options);
                }
                else {
                    const data = await this.findAll(options);
                    const total = await this.count({ where });
                    return {
                        data,
                        total,
                        page: 1,
                        totalPages: 1
                    };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding audit logs by filters', { error, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async exportLogs(dateFrom, dateTo, format = 'csv') {
        return tracer_1.tracer.startActiveSpan('repository.AuditLog.exportLogs', async (span) => {
            try {
                span.setAttributes({
                    dateFrom: dateFrom.toISOString(),
                    dateTo: dateTo.toISOString(),
                    format
                });
                const logs = await this.findAll({
                    where: {
                        timestamp: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                    },
                    order: [['timestamp', 'DESC']],
                    include: ['user'],
                    raw: true,
                    nest: true
                });
                span.setAttribute('count', logs.length);
                // Transform for export
                return logs.map(log => ({
                    timestamp: log.timestamp,
                    user: log.user?.email,
                    userType: log.userType,
                    action: log.action,
                    entityType: log.entityType,
                    entityId: log.entityId,
                    entityName: log.entityName,
                    ipAddress: log.ipAddress,
                    changes: JSON.stringify(log.changes)
                }));
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error exporting audit logs', { error, dateFrom, dateTo, format });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async logAction(data) {
        return tracer_1.tracer.startActiveSpan('repository.AuditLog.logAction', async (span) => {
            try {
                span.setAttributes({
                    userId: data.userId,
                    action: data.action,
                    entityType: data.entityType,
                    entityId: data.entityId
                });
                const log = await this.create(data);
                logger_1.default.info(`Audit log created: ${log.id}`, {
                    action: data.action,
                    entityType: data.entityType,
                    entityId: data.entityId
                });
                return log;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating audit log', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getSystemActivityStats(period = 'day') {
        return tracer_1.tracer.startActiveSpan('repository.AuditLog.getSystemActivityStats', async (span) => {
            try {
                span.setAttribute('period', period);
                const date = new Date();
                switch (period) {
                    case 'day':
                        date.setDate(date.getDate() - 1);
                        break;
                    case 'week':
                        date.setDate(date.getDate() - 7);
                        break;
                    case 'month':
                        date.setMonth(date.getMonth() - 1);
                        break;
                }
                const where = {
                    timestamp: { [sequelize_1.Op.gte]: date }
                };
                const [totalActions, byAction, byEntity, byUserType, topUsers] = await Promise.all([
                    this.count({ where }),
                    this.model.findAll({
                        attributes: ['action', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        where,
                        group: ['action']
                    }),
                    this.model.findAll({
                        attributes: ['entityType', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        where,
                        group: ['entityType']
                    }),
                    this.model.findAll({
                        attributes: ['userType', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        where,
                        group: ['userType']
                    }),
                    this.model.findAll({
                        attributes: [
                            'userId',
                            'userEmail',
                            [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'actionCount']
                        ],
                        where,
                        group: ['userId', 'userEmail'],
                        order: [[this.model.sequelize.literal('actionCount'), 'DESC']],
                        limit: 10
                    })
                ]);
                // Transform results
                const stats = {
                    totalActions,
                    byAction: byAction.reduce((acc, item) => {
                        acc[item.action] = parseInt(item.get('count'));
                        return acc;
                    }, {}),
                    byEntity: byEntity.reduce((acc, item) => {
                        acc[item.entityType] = parseInt(item.get('count'));
                        return acc;
                    }, {}),
                    byUserType: byUserType.reduce((acc, item) => {
                        acc[item.userType] = parseInt(item.get('count'));
                        return acc;
                    }, {}),
                    topUsers: topUsers.map(item => ({
                        userId: item.userId,
                        userEmail: item.userEmail,
                        actionCount: parseInt(item.get('actionCount'))
                    }))
                };
                span.setAttributes({
                    totalActions: stats.totalActions,
                    actionTypes: Object.keys(stats.byAction).length,
                    entityTypes: Object.keys(stats.byEntity).length
                });
                return stats;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting system activity stats', { error, period });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async cleanupOldLogs(retentionDays = 365) {
        return tracer_1.tracer.startActiveSpan('repository.AuditLog.cleanupOldLogs', async (span) => {
            try {
                span.setAttribute('retentionDays', retentionDays);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
                const deletedCount = await this.model.destroy({
                    where: {
                        timestamp: { [sequelize_1.Op.lt]: cutoffDate }
                    }
                });
                span.setAttribute('deletedCount', deletedCount);
                logger_1.default.info(`Cleaned up ${deletedCount} old audit logs (older than ${retentionDays} days)`);
                return deletedCount;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error cleaning up old audit logs', { error, retentionDays });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.AuditLogRepository = AuditLogRepository;
//# sourceMappingURL=AuditLogRepository.js.map