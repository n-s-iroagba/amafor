export enum ArticleStatus {
    Draft = 'draft',
    Published = 'published',
}

export interface Article {
    id: number;
    title: string;
    content: string;
    summary?: string;
    slug: string;
    status: ArticleStatus;
    readingTime?: number;
    createdAt: Date;
    updatedAt: Date;
}
