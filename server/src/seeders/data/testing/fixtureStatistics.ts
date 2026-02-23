// data/development/fixture-statistics.ts
import { FixtureStatisticsAttributes } from "../../../models/FixtureStatistics";

// Fixturees the Completed Fixture ID from developmentFixtures
const FIXTURE_ID = 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1';

export const developmentFixtureStatistics: FixtureStatisticsAttributes[] = [
  {
    id: 's1s1s1s1-s1s1-s1s1-s1s1-s1s1s1s1s1s1',
    fixtureId: FIXTURE_ID,

    // Possession (Academy dominated)
    homePossession: 62,
    awayPossession: 38,

    // Shots
    homeShots: 15,
    awayShots: 6,
    homeShotsOnTarget: 8,
    awayShotsOnTarget: 3,

    // Set Pieces
    homeCorners: 7,
    awayCorners: 2,

    // Discipline
    homeFouls: 9,
    awayFouls: 14,
    homeYellowCards: 1,
    awayYellowCards: 3,
    homeRedCards: 0,
    awayRedCards: 1,

    // Other
    homeOffsides: 4,
    awayOffsides: 1,

    createdAt: new Date(),
    updatedAt: new Date(),
  }
];