// data/development/lineup.ts
import { LineupAttributes } from "../../../models/Lineup";

// IDs from previous steps
const FIXTURE_ID = 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1';
const PLAYER_MUSA_ID = 'p1p1p1p1-p1p1-p1p1-p1p1-p1p1p1p1p1p1';
const PLAYER_DAVID_ID = 'p2p2p2p2-p2p2-p2p2-p2p2-p2p2p2p2p2p2';

export const developmentLineups: LineupAttributes[] = [
  {
    id: 'l1l1l1l1-l1l1-l1l1-l1l1-l1l1l1l1l1l1',
    fixtureId: FIXTURE_ID,
    playerId: PLAYER_MUSA_ID,
    position: 'ST',
    isStarter: true,
    jerseyNumber: 9,
    captain: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'l2l2l2l2-l2l2-l2l2-l2l2-l2l2l2l2l2l2',
    fixtureId: FIXTURE_ID,
    playerId: PLAYER_DAVID_ID,
    position: 'CB',
    isStarter: true,
    jerseyNumber: 4,
    captain: true, // David is the captain
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];