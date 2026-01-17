import { Model, Optional } from 'sequelize';
export declare enum NotificationType {
    SYSTEM = "system",
    USER = "user",
    PAYMENT = "payment",
    CONTENT = "content",
    SECURITY = "security"
}
export declare enum NotificationSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
export interface SystemNotificationAttributes {
    id: string;
    type: NotificationType;
    severity: NotificationSeverity;
    title: string;
    message: string;
    data: Record<string, any>;
    read: boolean;
    userId?: string;
    actionUrl?: string;
    expiresAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface SystemNotificationCreationAttributes extends Optional<SystemNotificationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'read' | 'metadata'> {
}
export declare class SystemNotification extends Model<SystemNotificationAttributes, SystemNotificationCreationAttributes> implements SystemNotificationAttributes {
    id: string;
    type: NotificationType;
    severity: NotificationSeverity;
    title: string;
    message: string;
    data: Record<string, any>;
    read: boolean;
    userId?: string;
    actionUrl?: string;
    expiresAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default SystemNotification;
//# sourceMappingURL=SystemNotification.d.ts.map