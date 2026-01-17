import { User, UserAttributes } from '../models';
export declare class UserService {
    private userRepository;
    private auditService;
    constructor();
    getUserProfile(userId: string): Promise<User | null>;
    updateUserProfile(userId: string, data: Partial<UserAttributes>): Promise<User>;
    verifyUser(adminId: string, targetUserId: string, status: string): Promise<User>;
}
//# sourceMappingURL=UserService.d.ts.map