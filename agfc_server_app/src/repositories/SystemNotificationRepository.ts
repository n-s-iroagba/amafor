import { FindOptions, Op } from 'sequelize';
import { SystemNotification, SystemNotificationCreationAttributes, NotificationType, NotificationSeverity } from '@models/SystemNotification';
import { BaseRepository } from './BaseRepository';
import  logger  from '@utils/logger';
import { tracer } from '@utils/tracer';
import { NotificationWithUser } from '../types/notification';

export interface NotificationFilterOptions {
  type?: NotificationType;
  severity?: NotificationSeverity;
  unreadOnly?: boolean;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class SystemNotificationRepository extends BaseRepository<SystemNotification> {
  constructor() {
    super(SystemNotification);
  }

  async createNotification(data: SystemNotificationCreationAttributes): Promise<SystemNotification> {
    return tracer.startActiveSpan('repository.SystemNotification.createNotification', async (span) => {
      try {
        span.setAttributes({
          type: data.type,
          severity: data.severity,
          userId: data.userId
        });

        const notification = await this.create(data);
        logger.info(`System notification created: ${notification.id}`, {
          type: data.type,
          severity: data.severity,
          userId: data.userId
        });
        
        return notification;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating system notification', { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async createBulkNotifications(notifications: SystemNotificationCreationAttributes[]): Promise<SystemNotification[]> {
    return tracer.startActiveSpan('repository.SystemNotification.createBulkNotifications', async (span) => {
      try {
        span.setAttribute('count', notifications.length);
        
        const createdNotifications = await Promise.all(
          notifications.map(notification => this.createNotification(notification))
        );

        logger.info(`Created ${createdNotifications.length} bulk notifications`);
        return createdNotifications;
      } catch (error) {
       
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating bulk notifications', { error, count: notifications.length });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findWithFilters(filters: NotificationFilterOptions, pagination?: { page: number; limit: number }): Promise<{ data: SystemNotification[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.SystemNotification.findWithFilters', async (span) => {
      try {
        span.setAttribute('filters', JSON.stringify(filters));

        const where: any = {};
        
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
          where[Op.or] = [
            { userId: filters.userId },
            { userId: null }
          ];
        } else {
          where.userId = null; // System-wide notifications by default
        }
        
        if (filters.dateFrom || filters.dateTo) {
          where.createdAt = {};
          if (filters.dateFrom) {
            where.createdAt[Op.gte] = filters.dateFrom;
          }
          if (filters.dateTo) {
            where.createdAt[Op.lte] = filters.dateTo;
          }
        }

        // Filter out expired notifications
        where[Op.or] = [
          { expiresAt: { [Op.gt]: new Date() } },
          { expiresAt: null }
        ];

        const options: FindOptions = {
          where,
          order: [['createdAt', 'DESC']],
          include: ['user']
        };

        if (pagination) {
          return await this.paginate(pagination.page, pagination.limit, options);
        } else {
          const data = await this.findAll(options);
          const total = await this.count({ where });
          return {
            data,
            total,
            page: 1,
            totalPages: 1
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error finding notifications with filters', { error, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async markAsRead(id: string): Promise<SystemNotification | null> {
    return tracer.startActiveSpan('repository.SystemNotification.markAsRead', async (span) => {
      try {
        span.setAttribute('id', id);
        
        const [affectedCount, notifications] = await this.update(
          id,
          { read: true }
        );

        if (affectedCount > 0) {
          logger.info(`Notification marked as read: ${id}`);
          return notifications[0];
        }

        return null;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error marking notification as read: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async markAllAsRead(userId?: string): Promise<number> {
    return tracer.startActiveSpan('repository.SystemNotification.markAllAsRead', async (span) => {
      try {
        span.setAttribute('userId', userId || 'all');
        
        const where: any = { read: false };
        if (userId) {
          where.userId = userId;
        } else {
          where.userId = null; // System-wide notifications
        }

        const [affectedCount] = await this.model.update(
          { read: true },
          { where }
        );

        span.setAttribute('affectedCount', affectedCount);
        logger.info(`Marked ${affectedCount} notifications as read`);
        
        return affectedCount;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error marking all notifications as read', { error, userId });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getUnreadCount(userId?: string): Promise<number> {
    return tracer.startActiveSpan('repository.SystemNotification.getUnreadCount', async (span) => {
      try {
        span.setAttribute('userId', userId || 'all');
        
        const where: any = { read: false };
        if (userId) {
          where[Op.or] = [
            { userId: userId },
            { userId: null }
          ];
        } else {
          where.userId = null; // System-wide notifications
        }

        // Filter out expired notifications
        where[Op.or] = [
          { expiresAt: { [Op.gt]: new Date() } },
          { expiresAt: null }
        ];

        const count = await this.count({ where });
        
        span.setAttribute('count', count);
        return count;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting unread notification count', { error, userId });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getNotificationStats(period: 'day' | 'week' | 'month' = 'day'): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    return tracer.startActiveSpan('repository.SystemNotification.getNotificationStats', async (span) => {
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
          createdAt: { [Op.gte]: date }
        };

        const [
          total,
          unread,
          byType,
          bySeverity
        ] = await Promise.all([
          this.count({ where }),
          this.count({ where: { ...where, read: false } }),
          this.model.findAll({
            attributes: ['type', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
            where,
            group: ['type']
          }),
          this.model.findAll({
            attributes: ['severity', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
            where,
            group: ['severity']
          })
        ]);

        const byTypeMap = (byType as any[]).reduce((acc, item) => {
          acc[item.type] = parseInt(item.get('count'));
          return acc;
        }, {});

        const bySeverityMap = (bySeverity as any[]).reduce((acc, item) => {
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
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting notification stats', { error, period });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async cleanupExpiredNotifications(): Promise<number> {
    return tracer.startActiveSpan('repository.SystemNotification.cleanupExpiredNotifications', async (span) => {
      try {
        const deletedCount = await this.model.destroy({
          where: {
            expiresAt: { [Op.lt]: new Date() },
            read: true // Only delete read notifications that have expired
          }
        });

        span.setAttribute('deletedCount', deletedCount);
        logger.info(`Cleaned up ${deletedCount} expired notifications`);
        
        return deletedCount;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error cleaning up expired notifications', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async createSystemAlert(title: string, message: string, severity: NotificationSeverity = NotificationSeverity.INFO, data?: any): Promise<SystemNotification> {
    return tracer.startActiveSpan('repository.SystemNotification.createSystemAlert', async (span) => {
      try {
        span.setAttributes({
          title,
          severity
        });

        const notification = await this.createNotification({
          type: NotificationType.SYSTEM,
          severity,
          title,
          message,
          data: data || {},
          read: false
        });

        logger.warn(`System alert created: ${notification.id}`, { title, severity });
        return notification;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating system alert', { error, title, severity });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async createUserNotification(userId: string, title: string, message: string, type: NotificationType = NotificationType.USER, data?: any): Promise<SystemNotification> {
    return tracer.startActiveSpan('repository.SystemNotification.createUserNotification', async (span) => {
      try {
        span.setAttributes({
          userId,
          title,
          type
        });

        const notification = await this.createNotification({
          type,
          severity: NotificationSeverity.INFO,
          title,
          message,
          userId,
          data: data || {},
          read: false
        });

        logger.info(`User notification created: ${notification.id}`, { userId, title, type });
        return notification;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating user notification', { error, userId, title, type });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async createPaymentNotification(userId: string, title: string, message: string, paymentData: any): Promise<SystemNotification> {
    return tracer.startActiveSpan('repository.SystemNotification.createPaymentNotification', async (span) => {
      try {
        span.setAttributes({
          userId,
          title
        });

        const notification = await this.createNotification({
          type: NotificationType.PAYMENT,
          severity: NotificationSeverity.INFO,
          title,
          message,
          userId,
          data: paymentData,
          read: false
        });

        logger.info(`Payment notification created: ${notification.id}`, { userId, title });
        return notification;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating payment notification', { error, userId, title });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getRecentNotifications(userId?: string, limit: number = 10): Promise<SystemNotification[]> {
    return tracer.startActiveSpan('repository.SystemNotification.getRecentNotifications', async (span) => {
      try {
        span.setAttributes({
          userId: userId || 'all',
          limit
        });

        const where: any = {};
        if (userId) {
          where[Op.or] = [
            { userId: userId },
            { userId: null }
          ];
        } else {
          where.userId = null; // System-wide notifications
        }

        // Filter out expired notifications
        where[Op.or] = [
          { expiresAt: { [Op.gt]: new Date() } },
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
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting recent notifications', { error, userId, limit });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async exportNotifications(format: 'csv' | 'json' = 'csv'): Promise<any[]> {
    return tracer.startActiveSpan('repository.SystemNotification.exportNotifications', async (span) => {
      try {
        span.setAttribute('format', format);
        
        const notifications = await this.findAll({
          include: ['user'],
          raw: true,
          nest: true
        })as NotificationWithUser[];

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
        })) ;

        span.setAttribute('count', exportData.length);
        return exportData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error exporting notifications', { error, format });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}