import User, { UserAttributes } from '@models/User';
export declare class UserService {
    private userRepository;
    private auditService;
    constructor();
    getUserProfile(userId: string): Promise<User | null>;
    updateUserProfile(userId: string, data: Partial<UserAttributes>): Promise<User>;
    verifyUser(adminId: string, targetUserId: string, status: string): Promise<User>;
    getPendingAdvertisers(): Promise<User[]>;
    getAllUsers(query?: any): Promise<User[]>;
    getUserById(userId: string): Promise<User | null>;
    createUser(userData: any): Promise<User>;
    deleteUser(userId: string, adminId: string): Promise<boolean>;
}
//# sourceMappingURL=UserService.d.ts.map