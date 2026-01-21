export enum UserType {
    FAN = 'fan',
    SCOUT = 'scout',
    ADVERTISER = 'advertiser',
    PATRON = 'patron',
    DONOR = 'donor',
    MEDIA_MANAGER = 'media_manager',
    SPORTS_ADMIN = 'sports_admin',
    DATA_STEWARD = 'data_steward',
    COMMERCIAL_MANAGER = 'commercial_manager',
    IT_SECURITY = 'it_security',
    SUPER_ADMIN = 'super_admin'
}

export enum UserStatus {
    ACTIVE = 'active',
    PENDING_VERIFICATION = 'pending_verification',
    SUSPENDED = 'suspended'
}

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    userType: UserType;
    status: UserStatus;
    emailVerified: boolean;
    isApproved?: boolean; // Manual approval required for scouts/advertisers
}
