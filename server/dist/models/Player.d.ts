import { Model, Optional } from 'sequelize';
export declare enum PlayerPosition {
    GK = "GK",
    DF = "DF",
    MF = "MF",
    FW = "FW"
}
export declare enum PlayerStatus {
    ACTIVE = "active",
    INJURED = "injured",
    SUSPENDED = "suspended",
    TRANSFERRED = "transferred"
}
export interface PlayerAttributes {
    id: string;
    name: string;
    dateOfBirth: Date;
    position: PlayerPosition;
    height?: number;
    nationality?: string;
    biography?: string;
    jerseyNumber?: number;
    imageUrl?: string;
    status: PlayerStatus;
    joinedDate?: Date;
    previousClubs: string[];
    contactEmail?: string;
    contactPhone?: string;
    agentName?: string;
    agentEmail?: string;
    metadata: Record<string, any>;
    createdById: string;
    updatedById: string;
    createdAt: Date;
    updatedAt: Date;
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
    deletedAt?: Date;
}
export interface PlayerCreationAttributes extends Optional<PlayerAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'previousClubs' | 'metadata'> {
}
export declare class Player extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
    id: string;
    name: string;
    dateOfBirth: Date;
    position: PlayerPosition;
    height?: number;
    nationality?: string;
    biography?: string;
    jerseyNumber?: number;
    imageUrl?: string;
    status: PlayerStatus;
    joinedDate?: Date;
    previousClubs: string[];
    contactEmail?: string;
    contactPhone?: string;
    agentName?: string;
    agentEmail?: string;
    metadata: Record<string, any>;
    createdById: string;
    updatedById: string;
    createdAt: Date;
    updatedAt: Date;
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
    deletedAt?: Date;
}
export default Player;
//# sourceMappingURL=Player.d.ts.map