export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags: ArticleTag[];
  authorId: string;
  viewCount: number;
  readTime: number;
  videoEmbedUrl?: string;
  videoProvider?: string;
  status: ArticleStatus;
  scheduledPublishAt?: Date;
  publishedAt?: Date;
  adZones: any[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}  
export enum ArticleTag {
  FOOTBALL_NEWS = 'football_news',
  MATCH_REPORT = 'match_report',
  ACADEMY_UPDATE = 'academy_update',
  PLAYER_SPOTLIGHT = 'player_spotlight',
  CLUB_ANNOUNCEMENT = 'club_announcement'
}

export enum ArticleStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}