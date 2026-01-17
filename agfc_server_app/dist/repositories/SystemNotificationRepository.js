"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemNotificationRepository = void 0;
const sequelize_1 = require("sequelize");
const SystemNotification_1 = require("@models/SystemNotification");
const BaseRepository_1 = require("./BaseRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
class SystemNotificationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(SystemNotification_1.SystemNotification);
    }
    async createNotification(data) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.createNotification', async (span) => {
            try {
                span.setAttributes({
                    type: data.type,
                    severity: data.severity,
                    userId: data.userId
                });
                const notification = await this.create(data);
                logger_1.default.info(`System notification created: ${notification.id}`, {
                    type: data.type,
                    severity: data.severity,
                    userId: data.userId
                });
                return notification;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating system notification', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async createBulkNotifications(notifications) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.createBulkNotifications', async (span) => {
            try {
                span.setAttribute('count', notifications.length);
                const createdNotifications = await Promise.all(notifications.map(notification => this.createNotification(notification)));
                logger_1.default.info(`Created ${createdNotifications.length} bulk notifications`);
                return createdNotifications;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating bulk notifications', { error, count: notifications.length });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findWithFilters(filters, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.findWithFilters', async (span) => {
            try {
                span.setAttribute('filters', JSON.stringify(filters));
                const where = {};
                // Apply filters
                if (filters.type) {
                    where.type = filters.type;
                }
                if (filters.severity) {
                    where.severity = filters.severity;
                }
                if (filters.unreadOnly) {
                    where.read = false;
                }
                if (filters.userId) {
                    where[sequelize_1.Op.or] = [
                        { userId: filters.userId },
                        { userId: null }
                    ];
                }
                else {
                    where.userId = null; // System-wide notifications by default
                }
                if (filters.dateFrom || filters.dateTo) {
                    where.createdAt = {};
                    if (filters.dateFrom) {
                        where.createdAt[sequelize_1.Op.gte] = filters.dateFrom;
                    }
                    if (filters.dateTo) {
                        where.createdAt[sequelize_1.Op.lte] = filters.dateTo;
                    }
                }
                // Filter out expired notifications
                where[sequelize_1.Op.or] = [
                    { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
                    { expiresAt: null }
                ];
                const options = {
                    where,
                    order: [['createdAt', 'DESC']],
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
                logger_1.default.error('Error finding notifications with filters', { error, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async markAsRead(id) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.markAsRead', async (span) => {
            try {
                span.setAttribute('id', id);
                const [affectedCount, notifications] = await this.update(id, { read: true });
                if (affectedCount > 0) {
                    logger_1.default.info(`Notification marked as read: ${id}`);
                    return notifications[0];
                }
                return null;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error marking notification as read: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async markAllAsRead(userId) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.markAllAsRead', async (span) => {
            try {
                span.setAttribute('userId', userId || 'all');
                const where = { read: false };
                if (userId) {
                    where.userId = userId;
                }
                else {
                    where.userId = null; // System-wide notifications
                }
                const [affectedCount] = await this.model.update({ read: true }, { where });
                span.setAttribute('affectedCount', affectedCount);
                logger_1.default.info(`Marked ${affectedCount} notifications as read`);
                return affectedCount;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error marking all notifications as read', { error, userId });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getUnreadCount(userId) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.getUnreadCount', async (span) => {
            try {
                span.setAttribute('userId', userId || 'all');
                const where = { read: false };
                if (userId) {
                    where[sequelize_1.Op.or] = [
                        { userId: userId },
                        { userId: null }
                    ];
                }
                else {
                    where.userId = null; // System-wide notifications
                }
                // Filter out expired notifications
                where[sequelize_1.Op.or] = [
                    { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
                    { expiresAt: null }
                ];
                const count = await this.count({ where });
                span.setAttribute('count', count);
                return count;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting unread notification count', { error, userId });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getNotificationStats(period = 'day') {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.getNotificationStats', async (span) => {
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
                    createdAt: { [sequelize_1.Op.gte]: date }
                };
                const [total, unread, byType, bySeverity] = await Promise.all([
                    this.count({ where }),
                    this.count({ where: { ...where, read: false } }),
                    this.model.findAll({
                        attributes: ['type', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        where,
                        group: ['type']
                    }),
                    this.model.findAll({
                        attributes: ['severity', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        where,
                        group: ['severity']
                    })
                ]);
                const byTypeMap = byType.reduce((acc, item) => {
                    acc[item.type] = parseInt(item.get('count'));
                    return acc;
                }, {});
                const bySeverityMap = bySeverity.reduce((acc, item) => {
                    acc[item.severity] = parseInt(item.get('count'));
                    return acc;
                }, {});
                const stats = {
                    total,
                    unread,
                    byType: byTypeMap,
                    bySeverity: bySeverityMap
                };
                span.setAttributes({
                    total: stats.total,
                    unread: stats.unread,
                    typeCount: Object.keys(stats.byType).length
                });
                return stats;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting notification stats', { error, period });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async cleanupExpiredNotifications() {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.cleanupExpiredNotifications', async (span) => {
            try {
                const deletedCount = await this.model.destroy({
                    where: {
                        expiresAt: { [sequelize_1.Op.lt]: new Date() },
                        read: true // Only delete read notifications that have expired
                    }
                });
                span.setAttribute('deletedCount', deletedCount);
                logger_1.default.info(`Cleaned up ${deletedCount} expired notifications`);
                return deletedCount;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error cleaning up expired notifications', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async createSystemAlert(title, message, severity = SystemNotification_1.NotificationSeverity.INFO, data) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.createSystemAlert', async (span) => {
            try {
                span.setAttributes({
                    title,
                    severity
                });
                const notification = await this.createNotification({
                    type: SystemNotification_1.NotificationType.SYSTEM,
                    severity,
                    title,
                    message,
                    data: data || {},
                    read: false
                });
                logger_1.default.warn(`System alert created: ${notification.id}`, { title, severity });
                return notification;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating system alert', { error, title, severity });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async createUserNotification(userId, title, message, type = SystemNotification_1.NotificationType.USER, data) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.createUserNotification', async (span) => {
            try {
                span.setAttributes({
                    userId,
                    title,
                    type
                });
                const notification = await this.createNotification({
                    type,
                    severity: SystemNotification_1.NotificationSeverity.INFO,
                    title,
                    message,
                    userId,
                    data: data || {},
                    read: false
                });
                logger_1.default.info(`User notification created: ${notification.id}`, { userId, title, type });
                return notification;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating user notification', { error, userId, title, type });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async createPaymentNotification(userId, title, message, paymentData) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.createPaymentNotification', async (span) => {
            try {
                span.setAttributes({
                    userId,
                    title
                });
                const notification = await this.createNotification({
                    type: SystemNotification_1.NotificationType.PAYMENT,
                    severity: SystemNotification_1.NotificationSeverity.INFO,
                    title,
                    message,
                    userId,
                    data: paymentData,
                    read: false
                });
                logger_1.default.info(`Payment notification created: ${notification.id}`, { userId, title });
                return notification;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating payment notification', { error, userId, title });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getRecentNotifications(userId, limit = 10) {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.getRecentNotifications', async (span) => {
            try {
                span.setAttributes({
                    userId: userId || 'all',
                    limit
                });
                const where = {};
                if (userId) {
                    where[sequelize_1.Op.or] = [
                        { userId: userId },
                        { userId: null }
                    ];
                }
                else {
                    where.userId = null; // System-wide notifications
                }
                // Filter out expired notifications
                where[sequelize_1.Op.or] = [
                    { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
                    { expiresAt: null }
                ];
                const notifications = await this.findAll({
                    where,
                    order: [['createdAt', 'DESC']],
                    limit,
                    include: ['user']
                });
                span.setAttribute('count', notifications.length);
                return notifications;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting recent notifications', { error, userId, limit });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async exportNotifications(format = 'csv') {
        return tracer_1.tracer.startActiveSpan('repository.SystemNotification.exportNotifications', async (span) => {
            try {
                span.setAttribute('format', format);
                const notifications = await this.findAll({
                    include: ['user'],
                    raw: true,
                    nest: true
                });
                // Transform for export
                const exportData = notifications.map(notification => ({
                    id: notification.id,
                    type: notification.type,
                    severity: notification.severity,
                    title: notification.title,
                    message: notification.message,
                    user: notification.user?.email,
                    read: notification.read,
                    createdAt: notification.createdAt,
                    expiresAt: notification.expiresAt
                }));
                span.setAttribute('count', exportData.length);
                return exportData;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error exporting notifications', { error, format });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.SystemNotificationRepository = SystemNotificationRepository;
//# sourceMappingURL=SystemNotificationRepository.js.map