export type UserRole = "admin" | "scout" | "advertiser";

export enum UserStatus {
  ACTIVE = "active",
  PENDING_VERIFICATION = "pending_verification",
  SUSPENDED = "suspended",
}

export interface AuthUser {
  id: string;
  username: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
}
