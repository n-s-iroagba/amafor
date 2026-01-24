import { Model, Optional } from 'sequelize';
export declare enum AuditAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    LOGIN = "login",
    LOGOUT = "logout",
    PAYMENT = "payment",
    VIEW = "view",
    ACCESS = "access",
    BULK_IMPORT = "bulk_import"
}
export declare enum EntityType {
    USER = "user",
    PLAYER = "player",
    ARTICLE = "article",
    FIXTURE = "fixture",
    CAMPAIGN = "campaign",
    DONATION = "donation",
    PATRON = "patron",
    SYSTEM = "system",
    STAFF = "staff"
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
export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'createdAt' | 'updatedAt' | 'changes' | 'metadata'> {
}
export declare class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
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
export default AuditLog;
//# sourceMappingURL=AuditLog.d.ts.map