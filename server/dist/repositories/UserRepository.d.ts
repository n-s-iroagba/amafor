import { FindOptions } from 'sequelize';
import { User, UserAttributes, UserCreationAttributes, UserType } from '@models/User';
import { BaseRepository } from './BaseRepository';
export declare class UserRepository extends BaseRepository<User> {
    private auditLogRepository;
    constructor();
    countNewToday(): Promise<number>;
    findByEmail(email: string, includePassword?: boolean): Promise<User | null>;
    createWithAudit(data: UserCreationAttributes, auditData: any): Promise<User>;
    updateWithAudit(id: string, data: Partial<UserAttributes>, auditData: any): Promise<User | null>;
    updateLoginInfo(id: string, ipAddress?: string): Promise<void>;
    incrementLoginAttempts(id: string): Promise<void>;
    findByType(userType: UserType, options?: FindOptions): Promise<User[]>;
    findPendingVerifications(): Promise<User[]>;
    verifyUser(id: string, verificationData: any): Promise<void>;
    searchUsers(query: string, options?: FindOptions): Promise<User[]>;
    getDashboardStats(): Promise<{
        total: number;
        active: number;
        pending: number;
        byType: Record<string, number>;
    }>;
}
//# sourceMappingURL=UserRepository.d.ts.map