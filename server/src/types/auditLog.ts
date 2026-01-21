import AuditLog from "@models/AuditLog";
import User from "@models/User";

export interface AuditLogWithUser extends AuditLog{
    user:User
    
}