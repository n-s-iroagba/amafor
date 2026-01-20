import { League } from "@/features/league/types";

export interface LeagueStatistics {
   id: string;
   leagueId: string;
   team: string;
   goalsFor: number;
   goalsAgainst: number;
   fixtureId?: string;
   matchesPlayed?: number;
   wins?: number;
   draws?: number;
   losses?: number;
   points?: number;
   goalDifference?: number;
   homeGoalsFor?: number;
   homeGoalsAgainst?: number;
   awayGoalsFor?: number;
   awayGoalsAgainst?: number;
   form?: string;
   cleanSheets?: number;
   failedToScore?: number;
   avgGoalsPerFixture?: number;
   avgGoalsConcededPerFixture?: number;
   lastFixtureDate?: Date;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface LeagueStatisticsWithLeague extends LeagueStatistics {
   league: League;
}

export interface LeagueTableProps {
   team: string;
   goalsFor: number;
   goalsAgainst: number;
   won: number;
   lost: number;
   draw: number;
   points: number;
   goalDifference: number;
   position: number;
   played: number;
}