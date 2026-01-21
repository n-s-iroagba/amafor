// data/development/player.ts
import { PlayerAttributes, PlayerPosition, PlayerStatus } from "../../../models/Player";

// IDs from previous steps
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

export const developmentPlayers: PlayerAttributes[] = [
  {
    // Fixturees the PlayerLeagueStatistics ID
    id: 'p1p1p1p1-p1p1-p1p1-p1p1-p1p1p1p1p1p1',
    name: 'Musa Ibrahim',
    dateOfBirth: new Date('2008-05-15'),
    position: PlayerPosition.FW,
    height: 1.78,
    nationality: 'Nigeria',
    biography: 'A prolific striker with pace and precision. Top scorer in the U-15 regional tournament.',
    jerseyNumber: 9,
    imageUrl: 'https://placehold.co/400x500/1d3557/ffffff?text=Musa+Ibrahim',
    status: PlayerStatus.ACTIVE,
    joinedDate: new Date('2023-01-10'),
    previousClubs: ['Local Youth Club', 'City Academy'],
    contactEmail: 'musa.parent@example.com',
    contactPhone: '+2348011112222',
    metadata: { preferred_foot: 'Right' },
    createdById: ADMIN_USER_ID,
    updatedById: ADMIN_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'p2p2p2p2-p2p2-p2p2-p2p2-p2p2p2p2p2p2',
    name: 'David Okafor',
    dateOfBirth: new Date('2008-08-22'),
    position: PlayerPosition.DF,
    height: 1.82,
    nationality: 'Nigeria',
    biography: 'Solid center back known for aerial dominance and leadership.',
    jerseyNumber: 4,
    imageUrl: 'https://placehold.co/400x500/457b9d/ffffff?text=David+Okafor',
    status: PlayerStatus.ACTIVE,
    joinedDate: new Date('2023-02-15'),
    previousClubs: [],
    metadata: { preferred_foot: 'Right' },
    createdById: ADMIN_USER_ID,
    updatedById: ADMIN_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];