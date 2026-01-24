export interface AuthUser {
    id: number;
    username: string;
    role: Role;
}
export declare enum Role {
    ADVERTISER = "advertiser",
    ADMIN = "admin",
    SPORTS_ADMIN = "sports-admin"
}
export interface AuthConfig {
    jwtSecret: string;
    clientUrl: string;
    tokenExpiration: {
        verification: number;
        login: number;
        refresh: number;
    };
}
export interface SignUpRequestDto {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    companyName: string;
    contactName: string;
    contact_email: string;
    contact_phone: string;
}
export type SignUpResponseDto = {
    verificationToken: string;
};
export interface VerifyEmailRequestDto {
    verificationCode: string;
    verificationToken: string;
}
export interface LoginRequestDto {
    email: string;
    password: string;
}
export type AuthServiceLoginResponse = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
};
export type LoginResponseDto = {
    accessToken: string;
    user: AuthUser;
};
export interface ForgotPasswordRequestDto {
    email: string;
}
export type ForgotPasswordResponseDto = {
    resetPasswordToken: string;
};
export interface ResetPasswordRequestDto {
    resetPasswordToken: string;
    password: string;
    confirmPassword: string;
}
export interface ResendVerificationRequestDto extends SignUpResponseDto {
}
export interface ResendVerificationRespnseDto extends SignUpResponseDto {
}
//# sourceMappingURL=auth.types.d.ts.map