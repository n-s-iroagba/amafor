import { Model, Optional } from 'sequelize';
export declare enum FixtureStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    POSTPONED = "postponed",
    CANCELLED = "cancelled"
}
export declare enum ArchiveStatus {
    PROCESSING = "processing",
    AVAILABLE = "available",
    FAILED = "failed"
}
export interface FixtureAttributes {
    id: string;
    matchDate: Date;
    homeTeam: string;
    awayTeam: string;
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
    archiveStatus: ArchiveStatus;
    availableAt?: Date;
    videoUrl?: string;
    videoProvider?: string;
    metadata: Record<string, any>;
    createdById: string;
    updatedById: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface FixtureCreationAttributes extends Optional<FixtureAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'archiveStatus' | 'metadata'> {
}
export declare class Fixture extends Model<FixtureAttributes, FixtureCreationAttributes> implements FixtureAttributes {
    id: string;
    matchDate: Date;
    homeTeam: string;
    awayTeam: string;
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
    archiveStatus: ArchiveStatus;
    availableAt?: Date;
    videoUrl?: string;
    videoProvider?: string;
    metadata: Record<string, any>;
    createdById: string;
    updatedById: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default Fixture;
//# sourceMappingURL=Fixture.d.ts.map