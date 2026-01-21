import { SystemNotificationRepository } from '../repositories';
import { structuredLogger, tracer } from '../utils';
import sequelize from '../config/database'; 

export class SystemService {
  private notificationRepo: SystemNotificationRepository;

  constructor() {
    this.notificationRepo = new SystemNotificationRepository();
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

  public async getCookieConsentConfig() {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      version: '1.0',
      lastUpdated: new Date().toISOString()
    };
  }
}