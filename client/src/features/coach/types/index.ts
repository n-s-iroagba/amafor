export interface Coach {
  id: number;
  name: string;
  role: string;
  imageUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}