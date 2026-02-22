import { UserStatus } from '@models/User';

export type UserRole = 'admin' | 'scout' | 'advertiser';

export interface AuthUser {
  id: string;
  username: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
}

export enum Role {
  ADVERTISER = 'advertiser',
  ADMIN = 'admin',
  SCOUT = 'scout',
}

export interface AuthConfig {
  jwtSecret: string
  clientUrl: string
  tokenExpiration: {
    verification: number
    login: number
    refresh: number
  }
}

export interface SignUpRequestDto {
  // --- User Fields ---
  email: string;
  password: string;
  confirmPassword: string;

  // --- Advertiser Fields ---
  companyName: string;
  contactName: string;
  contact_email: string;
  contact_phone: string;
}

export type SignUpResponseDto = {
  verificationToken: string
  id: string
}

export interface VerifyEmailRequestDto {
  verificationCode: string
  verificationToken: string
}

export interface LoginRequestDto {
  email: string
  password: string
}

export type AuthServiceLoginResponse = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export type LoginResponseDto = {
  accessToken: string
  user: AuthUser
}

export interface ForgotPasswordRequestDto {
  email: string
}

export type ForgotPasswordResponseDto = {
  resetPasswordToken: string
}

export interface ResetPasswordRequestDto {
  resetPasswordToken: string
  password: string
  confirmPassword: string
}

export interface ResendVerificationRequestDto extends SignUpResponseDto { }
export interface ResendVerificationRespnseDto extends SignUpResponseDto { }
