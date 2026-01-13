export interface League {
  id: number;
  name: string;
  logo?:string
  season: string;
  isFriendly: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}