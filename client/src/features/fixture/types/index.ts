import { League } from "@/features/league/types";


 export enum FixtureStatus {
  WON = 'won',
  LOST = 'lost',
  DRAW = 'draw',
  PLAYING = 'playing',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

export interface Fixture {
  id: number;
  leagueId: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeScore?: number;
  awayScore?: number;
  venue: string;
  status: FixtureStatus;
  createdAt: string;
  updatedAt: string;
}
export interface FixtureWithLeague extends Fixture{
    league:League

}
export interface MatchImage {
  id: string;
  fixtureId: string;
  url:string
  description:string

}