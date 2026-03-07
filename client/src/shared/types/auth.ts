export type UserRole =
  | "admin"
  | "scout"
  | "advertiser"
  | "academy_staff"
  | "commercial_manager"
  | "sports_admin"
  | "finance_officer"
  | "it_security"
  | "fan";

export enum UserStatus {
  ACTIVE = "active",
  PENDING_VERIFICATION = "pending_verification",
  SUSPENDED = "suspended",
}

export interface AuthUser {
  id: string;
  username: string;
  avatarUrl?: string;
  roles: UserRole[];
  status: UserStatus;
  emailVerified: boolean;
}
