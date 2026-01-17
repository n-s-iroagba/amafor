import { AuthServiceLoginResponse, AuthUser, LoginRequestDto, ResetPasswordRequestDto, SignUpRequestDto, SignUpResponseDto, VerifyEmailRequestDto } from '../types/auth.types';
import User from '../models/User';
export declare class AuthService {
    private readonly passwordService;
    private readonly userService;
    private readonly emailService;
    private readonly tokenService;
    private readonly verificationService;
    private readonly userRepository;
    constructor();
    /**
     * Registers a new user and initiates email verification.
     */
    signupAdvertiser(data: SignUpRequestDto): Promise<SignUpResponseDto>;
    /**
     * Creates a sports admin.
     */
    createSportsAdmin(data: SignUpRequestDto): Promise<User>;
    createAdmin(data: SignUpRequestDto): Promise<SignUpResponseDto>;
    /**
     * Logs a user in by validating credentials and returning tokens.
     */
    login(data: LoginRequestDto): Promise<AuthServiceLoginResponse | SignUpResponseDto>;
    /**
     * Issues a new access token from a refresh token.
     */
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    /**
     * Verifies a user's email using a token and code.
     */
    verifyEmail(data: VerifyEmailRequestDto): Promise<AuthServiceLoginResponse>;
    /**
     * Generates a new email verification code.
     */
    generateNewCode(token: string): Promise<string>;
    /**
     * Sends a password reset email to the user.
     */
    forgotPassword(email: string): Promise<void>;
    /**
     * Resets the user's password using the reset token.
     */
    resetPassword(data: ResetPasswordRequestDto): Promise<AuthServiceLoginResponse>;
    /**
     * Retrieves a user by ID.
     */
    getUserById(userId: string | number): Promise<any>;
    /**
     * Returns the current authenticated user's details.
     */
    getMe(userId: number): Promise<AuthUser>;
    private validatePassword;
    private generateTokenPair;
    private saveRefreshTokenAndReturn;
    private handleAuthError;
}
//# sourceMappingURL=AuthService.d.ts.map