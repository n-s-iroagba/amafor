// data/development/fixture.ts
import { FixtureAttributes, FixtureStatus, ArchiveStatus } from "../../../models/Fixture";

// Helper dates
const YESTERDAY = new Date(new Date().setDate(new Date().getDate() - 1));
const NEXT_WEEK = new Date(new Date().setDate(new Date().getDate() + 7));

// IDs from previous steps
const LEAGUE_ID = '11111111-aaaa-1111-aaaa-111111111111'; // Premier Youth League
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

export const developmentFixtures: FixtureAttributes[] = [
  // 1. Completed Fixture
  {
    id: 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
    matchDate: YESTERDAY,
    homeTeam: 'Academy U17',
    awayTeam: 'City Strikers',
    leagueId: LEAGUE_ID,
    venue: 'Main Academy Arena',
    status: FixtureStatus.COMPLETED,
    homeScore: 2,
    awayScore: 1,
    attendance: 450,
    referee: 'Mr. John Okoye',
    weather: 'Sunny',
    highlightsUrl: 'https://youtube.com/watch?v=highlights1',
    archiveStatus: ArchiveStatus.AVAILABLE,
    metadata: { broadcast: 'Live Stream' },
    createdById: ADMIN_USER_ID,
    updatedById: ADMIN_USER_ID,
    createdAt: YESTERDAY,
    updatedAt: YESTERDAY,
  },
  // 2. Scheduled Fixture
  {
    id: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
    matchDate: NEXT_WEEK,
    homeTeam: 'Rivers United Jnr',
    awayTeam: 'Academy U17',
    leagueId: LEAGUE_ID,
    venue: 'Liberation Stadium',
    status: FixtureStatus.SCHEDULED,
    homeScore: undefined,
    awayScore: undefined,
    archiveStatus: ArchiveStatus.PROCESSING,
    metadata: { tickets_sold: 150 },
    createdById: ADMIN_USER_ID,
    updatedById: ADMIN_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];