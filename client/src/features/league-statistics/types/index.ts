import { League } from "@/features/league/types"

export interface LeagueStatistics {
   id:string
   leagueId:string
   team:string
   goalsFor:number
   goalsAgainst:number
   fixtureId:number
}

export interface LeagueStatisticsWithLeague{
   league:League
}

export interface LeagueTableProps{
  team:string
   goalsFor:number
   goalsAgainst:number
   won:number
   lost:number
   draw:number
   points:number
   goalDifference:number
   position:number
   played:number
}