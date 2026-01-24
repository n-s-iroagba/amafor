export enum PlayerPosition {
    GK = 'GK',
    DF = 'DF',
    MF = 'MF',
    FW = 'FW'
}

export enum PlayerStatus {
    ACTIVE = 'active',
    INJURED = 'injured',
    SUSPENDED = 'suspended',
    TRANSFERRED = 'transferred'
}

export interface Player {
    id: string;
    name: string;
    dateOfBirth: Date | string;
    position: PlayerPosition | string;
    positionCategory?: string;
    height?: number;
    heightInCm?: number;
    nationality?: string;
    biography?: string;
    bio?: string; // Alias for biography
    jerseyNumber?: number;
    imageUrl?: string;
    status: PlayerStatus | string;
    form?: string;
    joinedDate?: Date | string;
    previousClubs?: string[];
    contactEmail?: string;
    contactPhone?: string;
    agentName?: string;
    agentEmail?: string;
    metadata?: Record<string, any>;
    createdById?: string;
    updatedById?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string;

    // Stats
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
    yellowCards?: number;
    redCards?: number;
    minutesPlayed?: number;
    rating?: number;

    // Legacy nested support (optional if we migrate)
    stats?: {
        appearances: number;
        goals: number;
        assists: number;
        minutesPlayed: number;
    };
}

