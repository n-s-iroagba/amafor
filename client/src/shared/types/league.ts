export interface League {
    id: string | number;
    name: string;
    season: string;
    isFriendly: boolean;
    logo?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
