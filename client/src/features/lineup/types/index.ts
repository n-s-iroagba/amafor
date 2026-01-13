import { Player } from "@/features/player/types"

export interface Lineup{
    id:string
    fixtureId:string
    playerId:string
    player:Player
    isStarting:boolean
}