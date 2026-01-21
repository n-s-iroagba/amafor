// data/development/goal.ts
import { GoalAttributes } from "../../../models/Goal";

// Linking to the Completed Fixture (ID: ...f1f1) defined above
const FIXTURE_ID = 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1';

export const developmentGoals: GoalAttributes[] = [
  {
    id: 1,
    fixtureId: FIXTURE_ID as any, // Cast to any if interface expects number, but DB needs UUID string
    scorer: 'Musa Ibrahim',
    minute: 15,
    isPenalty: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    fixtureId: FIXTURE_ID as any,
    scorer: 'City Striker #9',
    minute: 42,
    isPenalty: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    fixtureId: FIXTURE_ID as any,
    scorer: 'David Okafor',
    minute: 88, // Late winner
    isPenalty: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];