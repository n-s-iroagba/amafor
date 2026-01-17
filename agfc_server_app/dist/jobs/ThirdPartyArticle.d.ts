import { Model, Optional } from 'sequelize';
export interface ThirdPartyArticleAttributes {
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
export declare type ThirdPartyArticleCreationAttributes = Optional<ThirdPartyArticleAttributes, 'id' | 'created_at'>;
export declare class ThirdPartyArticle extends Model<ThirdPartyArticleAttributes, ThirdPartyArticleCreationAttributes> implements ThirdPartyArticleAttributes {
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
//# sourceMappingURL=ThirdPartyArticle.d.ts.map