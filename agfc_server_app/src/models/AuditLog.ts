import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PAYMENT = 'payment',
  VIEW = 'view',
  ACCESS = 'access'
}

export enum EntityType {
  USER = 'user',
  PLAYER = 'player',
  ARTICLE = 'article',
  FIXTURE = 'fixture',
  CAMPAIGN = 'campaign',
  DONATION = 'donation',
  PATRON = 'patron',
  SYSTEM = 'system'
}

export interface AuditLogAttributes {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  userType: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  changes: any[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'createdAt' | 'updatedAt' | 'changes' | 'metadata'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public timestamp!: Date;
  public userId!: string;
  public userEmail!: string;
  public userType!: string;
  public action!: AuditAction;
  public entityType!: EntityType;
  public entityId!: string;
  public entityName?: string;
  public oldValue?: any;
  public newValue?: any;
  public ipAddress?: string;
  public userAgent?: string;
  public changes!: any[];
  public metadata!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  static associate(models: any) {
    AuditLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }

  static initModel(sequelize: Sequelize): typeof AuditLog {
    AuditLog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false
        },
        userEmail: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        userType: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        action: {
          type: DataTypes.ENUM(...Object.values(AuditAction)),
          allowNull: false
        },
        entityType: {
          type: DataTypes.ENUM(...Object.values(EntityType)),
          allowNull: false
        },
        entityId: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        entityName: {
          type: DataTypes.STRING(200),
          allowNull: true
        },
        oldValue: {
          type: DataTypes.JSON,
          allowNull: true
        },
        newValue: {
          type: DataTypes.JSON,
          allowNull: true
        },
        ipAddress: {
          type: DataTypes.STRING(45),
          allowNull: true
        },
        userAgent: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        changes: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: []
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        } ,createdAt: {
          type:DataTypes.DATE
        },
        updatedAt: {
          type:DataTypes.DATE
        }
      },
      {
        sequelize,
        tableName: 'audit_logs',
        timestamps: true,
        indexes: [
          { fields: ['timestamp'] },
          { fields: ['userId'] },
          { fields: ['entityType', 'entityId'] },
          { fields: ['action'] },
          { fields: ['userType'] },
          { fields: ['createdAt'] }
        ]
      }
    );

    return AuditLog;
  }
}

export default AuditLog;