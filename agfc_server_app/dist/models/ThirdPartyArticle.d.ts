import { Model, Optional } from 'sequelize';
export interface ThirdPartyArticleAttributes {
    id: number;
    rssFeedSourceId: number;
    originalId: string;
    title: string;
    summary?: string | null;
    content?: string | null;
    publishedAt: Date;
    thumbnailUrl?: string | null;
    created_at?: Date;
}
export declare type ThirdPartyArticleCreationAttributes = Optional<ThirdPartyArticleAttributes, 'id' | 'created_at'>;
export declare class ThirdPartyArticle extends Model<ThirdPartyArticleAttributes, ThirdPartyArticleCreationAttributes> implements ThirdPartyArticleAttributes {
    id: number;
    rssFeedSourceId: number;
    originalId: string;
    title: string;
    summary: string | null;
    content: string | null;
    publishedAt: Date;
    thumbnailUrl: string | null;
    readonly created_at: Date;
}
export default ThirdPartyArticle;
//# sourceMappingURL=ThirdPartyArticle.d.ts.map