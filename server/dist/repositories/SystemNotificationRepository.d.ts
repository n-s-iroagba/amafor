import { SystemNotification, SystemNotificationCreationAttributes, NotificationType, NotificationSeverity } from '@models/SystemNotification';
import { BaseRepository } from './BaseRepository';
export interface NotificationFilterOptions {
    type?: NotificationType;
    severity?: NotificationSeverity;
    unreadOnly?: boolean;
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}
export declare class SystemNotificationRepository extends BaseRepository<SystemNotification> {
    constructor();
    createNotification(data: SystemNotificationCreationAttributes): Promise<SystemNotification>;
    createBulkNotifications(notifications: SystemNotificationCreationAttributes[]): Promise<SystemNotification[]>;
    findWithFilters(filters: NotificationFilterOptions, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        data: SystemNotification[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    markAsRead(id: string): Promise<SystemNotification | null>;
    markAllAsRead(userId?: string): Promise<number>;
    getUnreadCount(userId?: string): Promise<number>;
    getNotificationStats(period?: 'day' | 'week' | 'month'): Promise<{
        total: number;
        unread: number;
        byType: Record<string, number>;
        bySeverity: Record<string, number>;
    }>;
    cleanupExpiredNotifications(): Promise<number>;
    createSystemAlert(title: string, message: string, severity?: NotificationSeverity, data?: any): Promise<SystemNotification>;
    createUserNotification(userId: string, title: string, message: string, type?: NotificationType, data?: any): Promise<SystemNotification>;
    createPaymentNotification(userId: string, title: string, message: string, paymentData: any): Promise<SystemNotification>;
    getRecentNotifications(userId?: string, limit?: number): Promise<SystemNotification[]>;
    exportNotifications(format?: 'csv' | 'json'): Promise<any[]>;
}
//# sourceMappingURL=SystemNotificationRepository.d.ts.map