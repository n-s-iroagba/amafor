import { League } from './league';

export enum FixtureStatus {
    SCHEDULED = 'scheduled',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    POSTPONED = 'postponed',
    CANCELLED = 'cancelled',
    WON = 'won',
    LOST = 'lost',
    DRAW = 'draw',
    PLAYING = 'playing'
}

export enum ArchiveStatus {
    PROCESSING = 'processing',
    AVAILABLE = 'available',
    FAILED = 'failed'
}

export interface Fixture {
    id: string;
    matchDate: Date | string;
    homeTeam: string;
    awayTeam: string;
    homeTeamLogo?: string;
    awayTeamLogo?: string;
    leagueId: string;
    venue?: string;
    status: FixtureStatus;
    homeScore?: number;
    awayScore?: number;
    attendance?: number;
    referee?: string;
    weather?: string;
    matchReportArticleId?: string;
    highlightsUrl?: string;
    archiveStatus?: ArchiveStatus;
    availableAt?: Date | string;
    videoUrl?: string;
    videoProvider?: string;
    metadata?: Record<string, any>;
    createdById?: string;
    updatedById?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string;
}

export interface FixtureWithLeague extends Fixture {
    league?: League;
    date?: string | Date; // Alias for matchDate
}

export interface FixtureImage {
    id: string;
    fixtureId: string;
    url: string;
    description?: string;
}
