import sequelize from '@config/database';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum NotificationType {
  SYSTEM = 'system',
  USER = 'user',
  PAYMENT = 'payment',
  CONTENT = 'content',
  SECURITY = 'security'
}

export enum NotificationSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
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

export interface SystemNotificationCreationAttributes extends Optional<SystemNotificationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'read' | 'metadata'> {}

export class SystemNotification extends Model<SystemNotificationAttributes, SystemNotificationCreationAttributes> implements SystemNotificationAttributes {
  public id!: string;
  public type!: NotificationType;
  public severity!: NotificationSeverity;
  public title!: string;
  public message!: string;
  public data!: Record<string, any>;
  public read!: boolean;
  public userId?: string;
  public actionUrl?: string;
  public expiresAt?: Date;
  public metadata!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
  }


    SystemNotification.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        type: {
          type: DataTypes.ENUM(...Object.values(NotificationType)),
          allowNull: false
        },
        severity: {
          type: DataTypes.ENUM(...Object.values(NotificationSeverity)),
          allowNull: false,
          defaultValue: NotificationSeverity.INFO
        },
        title: {
          type: DataTypes.STRING(200),
          allowNull: false
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        data: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        },
        read: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: true
        },
        actionUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        }, createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
  
      },
      {
        sequelize,
        tableName: 'system_notifications',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['userId'] },
          { fields: ['type'] },
          { fields: ['severity'] },
          { fields: ['read'] },
          { fields: ['createdAt'] },
          { fields: ['expiresAt'] }
        ]
      }
    );



export default SystemNotification;