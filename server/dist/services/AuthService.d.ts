import User, { UserCreationAttributes } from '../models/User';
import { SignUpResponseDto, AuthServiceLoginResponse } from '../types/auth.types';
export declare class AuthService {
    private userRepository;
    private auditService;
    constructor();
    private hashPassword;
    private verifyPassword;
    private generateToken;
    register(data: UserCreationAttributes, ipAddress: string): Promise<{
        user: User;
        token: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<AuthServiceLoginResponse | SignUpResponseDto>;
    signupAdvertiser(data: any): Promise<SignUpResponseDto>;
    createAdmin(data: any): Promise<SignUpResponseDto>;
    createSportsAdmin(data: any): Promise<SignUpResponseDto>;
    generateNewCode(token: string): Promise<string>;
    forgotPassword(email: string): Promise<void>;
    getMe(userId: string): Promise<any>;
    verifyEmail(data: any): Promise<AuthServiceLoginResponse>;
    resetPassword(data: any): Promise<AuthServiceLoginResponse>;
    refreshToken(token: string): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map