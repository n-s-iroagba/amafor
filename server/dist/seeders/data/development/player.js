"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentPlayers = void 0;
// data/development/player.ts
const Player_1 = require("../../../models/Player");
// IDs from previous steps
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
exports.developmentPlayers = [
    {
        // Fixturees the PlayerLeagueStatistics ID
        id: 'p1p1p1p1-p1p1-p1p1-p1p1-p1p1p1p1p1p1',
        name: 'Musa Ibrahim',
        dateOfBirth: new Date('2008-05-15'),
        position: Player_1.PlayerPosition.FW,
        height: 1.78,
        nationality: 'Nigeria',
        biography: 'A prolific striker with pace and precision. Top scorer in the U-15 regional tournament.',
        jerseyNumber: 9,
        imageUrl: 'https://placehold.co/400x500/1d3557/ffffff?text=Musa+Ibrahim',
        status: Player_1.PlayerStatus.ACTIVE,
        joinedDate: new Date('2023-01-10'),
        previousClubs: ['Local Youth Club', 'City Academy'],
        contactEmail: 'musa.parent@example.com',
        contactPhone: '+2348011112222',
        metadata: { preferred_foot: 'Right' },
        appearances: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        createdById: ADMIN_USER_ID,
        updatedById: ADMIN_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'p2p2p2p2-p2p2-p2p2-p2p2-p2p2p2p2p2p2',
        name: 'David Okafor',
        dateOfBirth: new Date('2008-08-22'),
        position: Player_1.PlayerPosition.DF,
        height: 1.82,
        nationality: 'Nigeria',
        biography: 'Solid center back known for aerial dominance and leadership.',
        jerseyNumber: 4,
        imageUrl: 'https://placehold.co/400x500/457b9d/ffffff?text=David+Okafor',
        status: Player_1.PlayerStatus.ACTIVE,
        joinedDate: new Date('2023-02-15'),
        previousClubs: [],
        metadata: { preferred_foot: 'Right' },
        appearances: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        createdById: ADMIN_USER_ID,
        updatedById: ADMIN_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=player.js.map