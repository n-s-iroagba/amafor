"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentLeagueStatistics = void 0;
// IDs from previous steps
const LEAGUE_ID = '11111111-aaaa-1111-aaaa-111111111111';
const FIXTURE_ID = 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1';
const YESTERDAY = new Date(new Date().setDate(new Date().getDate() - 1));
exports.developmentLeagueStatistics = [
    // 1. Academy U17 (The winner)
    {
        id: 'ls1ls1ls-ls1ls-ls1ls-ls1ls-ls1ls1ls1ls1',
        leagueId: LEAGUE_ID,
        team: 'Academy U17',
        fixtureId: FIXTURE_ID, // Cast if model expects number vs UUID string mismatch in definitions
        matchesPlayed: 1,
        wins: 1,
        draws: 0,
        losses: 0,
        points: 3,
        goalsFor: 2,
        goalsAgainst: 1,
        goalDifference: 1,
        homeGoalsFor: 2,
        homeGoalsAgainst: 1,
        awayGoalsFor: 0,
        awayGoalsAgainst: 0,
        form: 'W',
        cleanSheets: 0,
        failedToScore: 0,
        avgGoalsPerFixture: 2.00,
        avgGoalsConcededPerFixture: 1.00,
        lastFixtureDate: YESTERDAY,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // 2. City Strikers (The loser)
    {
        id: 'ls2ls2ls-ls2ls-ls2ls-ls2ls-ls2ls2ls2ls2',
        leagueId: LEAGUE_ID,
        team: 'City Strikers',
        fixtureId: FIXTURE_ID,
        matchesPlayed: 1,
        wins: 0,
        draws: 0,
        losses: 1,
        points: 0,
        goalsFor: 1,
        goalsAgainst: 2,
        goalDifference: -1,
        homeGoalsFor: 0,
        homeGoalsAgainst: 0,
        awayGoalsFor: 1,
        awayGoalsAgainst: 2,
        form: 'L',
        cleanSheets: 0,
        failedToScore: 0,
        avgGoalsPerFixture: 1.00,
        avgGoalsConcededPerFixture: 2.00,
        lastFixtureDate: YESTERDAY,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=leaguestatistics.js.map