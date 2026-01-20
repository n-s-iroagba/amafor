export enum RssFeedSourceCategory {
    SPORTS = 'sports',
    GENERAL = 'general',
    BUSINESS = 'business',
    ENTERTAINMENT = 'entertainment',
    NIGERIA = 'nigeria'
}

export interface RssFeedSource {
    id: number;
    name: string;
    feedUrl: string;
    category: RssFeedSourceCategory;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
