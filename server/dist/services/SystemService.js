"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
const database_1 = __importDefault(require("../config/database"));
class SystemService {
    constructor() {
        this.notificationRepo = new repositories_1.SystemNotificationRepository();
    }
    async getHealthStatus() {
        return utils_1.tracer.startActiveSpan('service.SystemService.getHealthStatus', async (span) => {
            const start = Date.now();
            let dbStatus = 'disconnected';
            try {
                await database_1.default.authenticate();
                dbStatus = 'connected';
            }
            catch (e) {
                utils_1.structuredLogger.error('Database health check failed', { error: e.message });
            }
            const health = {
                status: dbStatus === 'connected' ? 'healthy' : 'degraded',
                timestamp: new Date(),
                uptime: process.uptime(),
                database: dbStatus,
                memory: process.memoryUsage(),
                latency: Date.now() - start
            };
            span.setAttribute('health.status', health.status);
            span.end();
            return health;
        });
    }
    async createNotification(title, message, type, severity, targetUserId) {
        return utils_1.tracer.startActiveSpan('service.SystemService.createNotification', async (span) => {
            try {
                const notification = await this.notificationRepo.create({
                    title,
                    message,
                    type,
                    severity,
                    userId: targetUserId,
                    read: false,
                    data: {},
                    metadata: {}
                });
                // Log business event if it's a critical system broadcast
                if (severity === 'CRITICAL' && !targetUserId) {
                    utils_1.structuredLogger.business('SYSTEM_BROADCAST', 0, 'system', { title, message });
                }
                return notification;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to create notification', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.SystemService = SystemService;
//# sourceMappingURL=SystemService.js.map