// data/development/league.ts
import { LeagueAttributes } from "../../../models/League";

export const developmentLeagues: LeagueAttributes[] = [
  {
    id: '11111111-aaaa-1111-aaaa-111111111111',
    name: 'Premier Youth League',
    season: '2025/2026',
    isFriendly: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '22222222-bbbb-2222-bbbb-222222222222',
    name: 'Regional Friendly Series',
    season: '2025',
    isFriendly: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];