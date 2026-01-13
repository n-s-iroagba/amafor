// Player position types
export type PlayerPosition = 
  | 'GOALKEEPER'
  | 'DEFENDER'
  | 'DEFENDER_CENTER_BACK'
  | 'DEFENDER_LEFT_BACK'
  | 'DEFENDER_RIGHT_BACK'
  | 'DEFENDER_WING_BACK'
  | 'MIDFIELDER'
  | 'MIDFIELDER_CENTER'
  | 'MIDFIELDER_DEFENSIVE'
  | 'MIDFIELDER_ATTACKING'
  | 'MIDFIELDER_LEFT'
  | 'MIDFIELDER_RIGHT'
  | 'FORWARD'
  | 'FORWARD_CENTER'
  | 'FORWARD_LEFT_WING'
  | 'FORWARD_RIGHT_WING'
  | 'FORWARD_SECOND_STRIKER'
  | 'FORWARD_STRIKER';

// Player status types
export type PlayerStatus = 
  | 'ACTIVE'
  | 'INJURED'
  | 'SUSPENDED'
  | 'BENCHED'
  | 'RESERVE'
  | 'LOANED_OUT'
  | 'TRANSFERRED'
  | 'RETIRED'
  | 'INACTIVE'
  | 'ON_LEAVE';
export type PositionCategory = 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';

export type InjurySeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'LONG_TERM';

export type ContractStatus = 
  | 'ACTIVE'
  | 'EXPIRED'
  | 'LOAN'
  | 'TRANSFER_LISTED'
  | 'NEGOTIATING'
  | 'TERMINATED';

export type PlayerForm = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' | 'TERRIBLE';
// Player attributes interface (your existing interface)
export interface Player {
  id: string;
  name: string;
  bio:string
  dateOfBirth: Date;
  position: PlayerPosition;
  positionCategory: PositionCategory;
  injuryConditions?:InjurySeverity
  contractStatus:ContractStatus
  form:PlayerForm
  heightInCm?: number; // in centimeters
  nationality?: string;
  biography?: string;
  jerseyNumber?: number;
  imageUrl?: string;
  status: PlayerStatus;
  joinedDate?: Date;
  previousClubs: string[];
  contactEmail?: string;
  contactPhone?: string;
  metadata: Record<string, any>;
  createdById: string;
  updatedById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
export interface PlayerLeagueStatistics{
    leagueId:string
    playerId:string
appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
    minutesPlayed: number;
  starts: number;
  penaltiesScored:number
}
export interface PlayerAgent{
    name: string;
  email: string;
  phone:string
  playerId:string

}
export interface PlayerFixtureStastics{
    fixtureId:string
    goals?: number;
  assists?: number;
  cleanSheets?: number;
  rating?: number;

}




