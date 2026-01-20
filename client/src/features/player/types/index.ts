export * from '@/shared/types/player';

// Additional UI-specific player types
export enum PositionCategory {
  GOALKEEPER = 'Goalkeeper',
  DEFENDER = 'Defender',
  MIDFIELDER = 'Midfielder',
  FORWARD = 'Forward'
}

// Extended player interface with UI display properties
export interface PlayerWithStats {
  id: string;
  name: string;
  position: string;
  positionCategory?: PositionCategory;
  jerseyNumber?: number;
  imageUrl?: string;
  nationality?: string;
  status: string;
  heightInCm?: number;
  form?: string;
  bio?: string;
  biography?: string;
}
