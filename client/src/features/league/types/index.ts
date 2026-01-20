export interface League {
  id: string;
  name: string;
  season: string;
  isFriendly: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}