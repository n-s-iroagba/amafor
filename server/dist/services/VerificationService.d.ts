import User from '../models/User';
export interface AuthConfig {
    jwtSecret: string;
    clientUrl: string;
    tokenExpiration: {
        verification: number;
        login: number;
        refresh: number;
    };
}
export declare class VerificationService {
    private readonly tokenService;
    private readonly emailService;
    private readonly config;
    constructor();
    initiateEmailVerificationProcess(user: User): Promise<{
        verificationToken: string;
        id: string;
    }>;
    regenerateVerificationCode(token: string): Promise<string>;
    validateVerificationCode(user: User, token: string): void;
}
//# sourceMappingURL=VerificationService.d.ts.map