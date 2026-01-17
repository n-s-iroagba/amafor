"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentFixtures = void 0;
// data/development/fixture.ts
const Fixture_1 = require("../../../models/Fixture");
// Helper dates
const YESTERDAY = new Date(new Date().setDate(new Date().getDate() - 1));
const NEXT_WEEK = new Date(new Date().setDate(new Date().getDate() + 7));
// IDs from previous steps
const LEAGUE_ID = '11111111-aaaa-1111-aaaa-111111111111'; // Premier Youth League
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
exports.developmentFixtures = [
    // 1. Completed Match
    {
        id: 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
        matchDate: YESTERDAY,
        homeTeam: 'Academy U17',
        awayTeam: 'City Strikers',
        leagueId: LEAGUE_ID,
        venue: 'Main Academy Arena',
        status: Fixture_1.FixtureStatus.COMPLETED,
        homeScore: 2,
        awayScore: 1,
        attendance: 450,
        referee: 'Mr. John Okoye',
        weather: 'Sunny',
        highlightsUrl: 'https://youtube.com/watch?v=highlights1',
        archiveStatus: Fixture_1.ArchiveStatus.AVAILABLE,
        metadata: { broadcast: 'Live Stream' },
        createdById: ADMIN_USER_ID,
        updatedById: ADMIN_USER_ID,
        createdAt: YESTERDAY,
        updatedAt: YESTERDAY,
    },
    // 2. Scheduled Match
    {
        id: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
        matchDate: NEXT_WEEK,
        homeTeam: 'Rivers United Jnr',
        awayTeam: 'Academy U17',
        leagueId: LEAGUE_ID,
        venue: 'Liberation Stadium',
        status: Fixture_1.FixtureStatus.SCHEDULED,
        homeScore: undefined,
        awayScore: undefined,
        archiveStatus: Fixture_1.ArchiveStatus.PROCESSING,
        metadata: { tickets_sold: 150 },
        createdById: ADMIN_USER_ID,
        updatedById: ADMIN_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=fixtures.js.map