import { Model, Optional } from 'sequelize';
export declare enum UserType {
    FAN = "fan",
    SCOUT = "scout",
    ADVERTISER = "advertiser",
    PATRON = "patron",
    DONOR = "donor",
    MEDIA_MANAGER = "media_manager",
    SPORTS_ADMIN = "sports_admin",
    DATA_STEWARD = "data_steward",
    COMMERCIAL_MANAGER = "commercial_manager",
    IT_SECURITY = "it_security",
    SUPER_ADMIN = "super_admin"
}
export declare enum UserStatus {
    ACTIVE = "active",
    PENDING_VERIFICATION = "pending_verification",
    SUSPENDED = "suspended"
}
export interface UserAttributes {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    userType: UserType;
    roles: string[];
    status: UserStatus;
    emailVerified: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    metadata: Record<string, any>;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'status' | 'emailVerified' | 'metadata' | 'loginAttempts'> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    userType: UserType;
    roles: string[];
    status: UserStatus;
    emailVerified: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    metadata: Record<string, any>;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map