import { StringValue } from 'ms';
export interface JwtPayload {
    email: string;
    role: string;
    permissions?: string[];
    tokenType?: 'access' | 'refresh' | 'reset_password' | 'email_verification';
    purpose?: string;
    verificationToken?: string;
    requestId?: string;
    iat?: number;
    exp?: number;
    nbf?: number;
    iss?: string;
    aud?: string;
    sub?: string;
    user?: {
        id: string;
    };
}
export interface EmailVerificationTokenPayload extends Omit<JwtPayload, 'role' | 'tokenType' | 'purpose'> {
    email: string;
    verificationToken: string;
    tokenType: 'email_verification';
    purpose: 'email_verification';
    requestId?: string;
}
export interface AccessTokenPayload extends JwtPayload {
    id: string;
}
export interface ResetPasswordTokenPayload extends Omit<JwtPayload, 'role'> {
    id: string;
    email: string;
    requestId?: string;
}
export interface TokenGenerationOptions {
    expiresIn?: string | number | StringValue;
    issuer?: string;
    audience?: string;
    subject?: string;
}
export interface TokenVerificationResult {
    decoded: JwtPayload;
}
//# sourceMappingURL=token.types.d.ts.map