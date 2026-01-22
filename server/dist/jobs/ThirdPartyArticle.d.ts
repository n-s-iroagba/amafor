import { Model, Optional } from 'sequelize';
export interface FeaturedNewsAttributes {
    id: number;
    rss_feed_source_id: number;
    original_id: string;
    title: string;
    summary?: string | null;
    content?: string | null;
    article_url: string;
    published_at: Date;
    thumbnail_url?: string | null;
    created_at?: Date;
}
export declare type FeaturedNewsCreationAttributes = Optional<FeaturedNewsAttributes, 'id' | 'created_at'>;
export declare class FeaturedNews extends Model<FeaturedNewsAttributes, FeaturedNewsCreationAttributes> implements FeaturedNewsAttributes {
    id: number;
    rss_feed_source_id: number;
    original_id: string;
    title: string;
    summary: string | null;
    content: string | null;
    article_url: string;
    published_at: Date;
    thumbnail_url: string | null;
    readonly created_at: Date;
}
//# sourceMappingURL=FeaturedNews.d.ts.map