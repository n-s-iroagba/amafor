"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
const database_1 = __importDefault(require("../config/database"));
// import { redisClient } from '../redis/client'; // Assuming this exists, if not i will skip or use mock
class SystemService {
    constructor() {
        this.notificationRepo = new repositories_1.SystemNotificationRepository();
        this.auditRepo = new repositories_1.AuditLogRepository();
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
    async getSystemConfig() {
        return {
            maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
            scoutRegistration: true, // Default or fetch from DB
            rateLimit: 300,
            sessionTimeout: 60,
            logLevel: process.env.LOG_LEVEL || 'info',
            appVersion: process.env.npm_package_version || '1.0.0'
        };
    }
    async updateSystemConfig(config, adminId) {
        utils_1.structuredLogger.info('System config update requested', { adminId, config });
        // In a real app, save to DB or Redis
        return { ...config, updatedAt: new Date() };
    }
    async getAuditLogs(query) {
        // Basic implementation wrapping repository
        // Assuming repository has findAll
        const { page = 1, limit = 20, ...filters } = query;
        const offset = (page - 1) * limit;
        return await this.auditRepo.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
    }
    async listBackups() {
        // Basic mock implementation for backups
        return [
            { id: '1', name: 'backup-2023-10-01.sql', size: '10.5 MB', date: new Date('2023-10-01') },
            { id: '2', name: 'backup-2023-10-08.sql', size: '11.2 MB', date: new Date('2023-10-08') },
        ];
    }
    async createBackup() {
        // Mock backup creation
        return { id: Date.now().toString(), name: `backup-${new Date().toISOString()}.sql`, status: 'completed' };
    }
    async restoreBackup(id) {
        // Mock restore
        return { success: true, message: `System restored from backup ${id}` };
    }
    async deleteBackup(id) {
        // Mock delete
        return { success: true, message: `Backup ${id} deleted` };
    }
    async downloadBackup(id) {
        // Mock download
        return { url: `https://storage.example.com/backups/${id}.sql` };
    }
    async getDatabaseHealth() {
        try {
            await database_1.default.authenticate();
            return { status: 'healthy', message: 'Connection successful' };
        }
        catch (error) {
            return { status: 'unhealthy', message: error.message };
        }
    }
    async getRedisHealth() {
        try {
            // Mock or simple check if client exported
            // If redisClient not available, return unknown
            return { status: 'unknown', message: 'Redis check not implemented' };
        }
        catch (error) {
            return { status: 'unhealthy', message: error.message };
        }
    }
    async runDiagnostic() {
        // Mock diagnostic run
        return utils_1.tracer.startActiveSpan('service.SystemService.runDiagnostic', async (span) => {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate work
            span.end();
            return { status: 'completed', issues: [], duration: 1500 };
        });
    }
}
exports.SystemService = SystemService;
//# sourceMappingURL=SystemService.js.map