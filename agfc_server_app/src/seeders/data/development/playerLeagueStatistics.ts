// data/development/player-league-statistics.ts
import { PlayerLeagueStatisticsAttributes } from "../../../models/PlayerLeagueStatistics";

// IDs from previous/future steps
const LEAGUE_ID = '11111111-aaaa-1111-aaaa-111111111111';
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
// Placeholder Player ID - Ensure you create a Player with this ID
const PLAYER_ID = 'p1p1p1p1-p1p1-p1p1-p1p1-p1p1p1p1p1p1'; 

export const developmentPlayerLeagueStatistics: PlayerLeagueStatisticsAttributes[] = [
  {
    id: 'pl1pl1pl-pl1pl-pl1pl-pl1pl-pl1pl1pl1pl1',
    playerId: PLAYER_ID,
    leagueId: LEAGUE_ID,
    assists: 4,
    cleanSheets: 0, // 0 for an outfielder usually
    yellowCards: 1,
    redCards: 0,
    minutesPlayed: 450, // e.g., 5 full games
    createdById: ADMIN_USER_ID,
    updatedById: ADMIN_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];