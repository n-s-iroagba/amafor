import { StringValue } from 'ms';
import { AccessTokenPayload, JwtPayload, ResetPasswordTokenPayload, TokenVerificationResult } from '../types/token.types';
import User from '@models/User';
export declare class TokenService {
    private readonly secret;
    private readonly refreshSecret?;
    private readonly resetPasswordSecret?;
    private readonly emailVerificationSecret?;
    private readonly defaultOptions;
    private readonly tokenExpirations;
    constructor(secret: string, refreshSecret?: string | undefined, resetPasswordSecret?: string | undefined, emailVerificationSecret?: string | undefined);
    /**
     * Generate an access token with User authentication info
     */
    generateAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp' | 'nbf'>, customExpiresIn?: number | StringValue): string;
    /**
     * Generate a password reset token
     */
    generateResetPasswordToken(payload: Omit<ResetPasswordTokenPayload, 'iat' | 'exp' | 'nbf' | 'purpose'>, customExpiresIn?: number | StringValue): string;
    /**
     * Generate an email verification token
     */
    generateEmailVerificationToken(User: User, customExpiresIn?: StringValue | number): string;
    /**
     * Generate refresh token with different secret (if provided)
     */
    generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp' | 'nbf' | 'tokenType'>, expiresIn?: number | StringValue): string;
    /**
     * Verify token with comprehensive expiration and error handling
     * Now supports different token types with their respective secrets
     * Throws errors to be handled by middleware
     */
    verifyToken(token: string, tokenType: 'access' | 'refresh' | 'reset_password' | 'email_verification'): TokenVerificationResult;
    /**
     * Verify access token specifically
     */
    verifyAccessToken(token: string): TokenVerificationResult;
    /**
     * Verify refresh token specifically
     */
    verifyRefreshToken(token: string): TokenVerificationResult;
    /**
     * Verify reset password token specifically
     */
    verifyResetPasswordToken(token: string): TokenVerificationResult;
    /**
     * Verify email verification token specifically
     */
    verifyEmailVerificationToken(token: string): TokenVerificationResult;
    /**
     * Check if token is expired without full verification
     */
    isTokenExpired(token: string): boolean;
    /**
     * Get token expiration info without verification
     */
    getTokenExpirationInfo(token: string): {
        isExpired: boolean;
        expiresAt?: Date;
        expiresIn?: number;
        issuedAt?: Date;
    };
    /**
     * Decode token without verification (enhanced version)
     */
    decodeToken(token: string): JwtPayload | null;
    /**
     * Check if token needs refresh (within refresh threshold)
     */
    shouldRefreshToken(token: string, refreshThresholdMinutes?: number): boolean;
    /**
     * Extract User info from token safely
     */
    extractUserInfo(token: string): {
        userId?: number;
        email?: string;
        role?: string;
        tokenType?: string;
        permissions?: string[];
        purpose?: string;
    } | null;
    /**
     * Generate complete authentication token set (access + refresh)
     */
    generateAuthTokens(payload: Omit<AccessTokenPayload, 'iat' | 'exp' | 'nbf'>): {
        accessToken: string;
        refreshToken: string;
        accessExpiresIn: number;
        refreshExpiresIn: number;
    };
    /**
     * Generate token pair (access + refresh) - legacy method
     */
    generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp' | 'tokenType'>): {
        accessToken: string;
        refreshToken: string;
        accessExpiresIn: number;
        refreshExpiresIn: number;
    };
    /**
     * Get token expiration defaults
     */
    getTokenExpirationDefaults(): typeof this.tokenExpirations;
    /**
     * Update token expiration defaults
     */
    updateTokenExpirationDefaults(updates: Partial<typeof this.tokenExpirations>): void;
}
declare const _default: TokenService;
export default _default;
//# sourceMappingURL=TokenService.d.ts.map