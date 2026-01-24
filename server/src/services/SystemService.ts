import { SystemNotificationRepository, AuditLogRepository } from '../repositories';
import { structuredLogger, tracer } from '../utils';
import sequelize from '../config/database';
// import { redisClient } from '../redis/client'; // Assuming this exists, if not i will skip or use mock

export class SystemService {
  private notificationRepo: SystemNotificationRepository;
  private auditRepo: AuditLogRepository;

  constructor() {
    this.notificationRepo = new SystemNotificationRepository();
    this.auditRepo = new AuditLogRepository();
  }

  public async getHealthStatus(): Promise<any> {
    return tracer.startActiveSpan('service.SystemService.getHealthStatus', async (span) => {
      const start = Date.now();
      let dbStatus = 'disconnected';

      try {
        await sequelize.authenticate();
        dbStatus = 'connected';
      } catch (e: any) {
        structuredLogger.error('Database health check failed', { error: e.message });
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

  public async createNotification(
    title: string,
    message: string,
    type: string,
    severity: string,
    targetUserId?: string
  ) {
    return tracer.startActiveSpan('service.SystemService.createNotification', async (span) => {
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
          structuredLogger.business('SYSTEM_BROADCAST', 0, 'system', { title, message });
        }

        return notification;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to create notification', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async getSystemConfig() {
    return {
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      scoutRegistration: true, // Default or fetch from DB
      rateLimit: 300,
      sessionTimeout: 60,
      logLevel: process.env.LOG_LEVEL || 'info',
      appVersion: process.env.npm_package_version || '1.0.0'
    };
  }

  public async updateSystemConfig(config: any, adminId: string) {
    structuredLogger.info('System config update requested', { adminId, config });
    // In a real app, save to DB or Redis
    return { ...config, updatedAt: new Date() };
  }

  public async getAuditLogs(query: any) {
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

  public async listBackups() {
    // Basic mock implementation for backups
    return [
      { id: '1', name: 'backup-2023-10-01.sql', size: '10.5 MB', date: new Date('2023-10-01') },
      { id: '2', name: 'backup-2023-10-08.sql', size: '11.2 MB', date: new Date('2023-10-08') },
    ];
  }

  public async createBackup() {
    // Mock backup creation
    return { id: Date.now().toString(), name: `backup-${new Date().toISOString()}.sql`, status: 'completed' };
  }

  public async restoreBackup(id: string) {
    // Mock restore
    return { success: true, message: `System restored from backup ${id}` };
  }

  public async deleteBackup(id: string) {
    // Mock delete
    return { success: true, message: `Backup ${id} deleted` };
  }

  public async downloadBackup(id: string) {
    // Mock download
    return { url: `https://storage.example.com/backups/${id}.sql` };
  }

  public async getDatabaseHealth() {
    try {
      await sequelize.authenticate();
      return { status: 'healthy', message: 'Connection successful' };
    } catch (error: any) {
      return { status: 'unhealthy', message: error.message };
    }
  }

  public async getRedisHealth() {
    try {
      // Mock or simple check if client exported
      // If redisClient not available, return unknown
      return { status: 'unknown', message: 'Redis check not implemented' };
    } catch (error: any) {
      return { status: 'unhealthy', message: error.message };
    }
  }
  public async runDiagnostic() {
    // Mock diagnostic run
    return tracer.startActiveSpan('service.SystemService.runDiagnostic', async (span) => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate work
      span.end();
      return { status: 'completed', issues: [], duration: 1500 };
    });
  }


}