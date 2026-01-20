import { Player, PlayerPosition, PlayerStatus } from './player';

export interface Lineup {
    id: string;
    fixtureId: string;
    playerId: string;
    position: string;
    isStarter: boolean;
    isStarting?: boolean; // Alias for isStarter
    jerseyNumber?: number | null;
    captain: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    player?: Player;
}

export type { Player, PlayerPosition, PlayerStatus };
