import { User, UserCreationAttributes } from '../models';
export declare class AuthService {
    private userRepository;
    private auditService;
    constructor();
    register(data: UserCreationAttributes, ipAddress: string): Promise<{
        user: User;
        token: string;
    }>;
    login(email: string, password: string, ipAddress: string): Promise<{
        user: User;
        token: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map