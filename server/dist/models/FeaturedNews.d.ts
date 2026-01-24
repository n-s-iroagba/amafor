import { Model, Optional } from 'sequelize';
export interface FeaturedNewsAttributes {
    id: string;
    rssFeedSourceId: string;
    originalId: string;
    title: string;
    summary?: string | null;
    content?: string | null;
    publishedAt: Date;
    thumbnailUrl?: string | null;
    created_at?: Date;
}
export type FeaturedNewsCreationAttributes = Optional<FeaturedNewsAttributes, 'id' | 'created_at'>;
export declare class FeaturedNews extends Model<FeaturedNewsAttributes, FeaturedNewsCreationAttributes> implements FeaturedNewsAttributes {
    id: string;
    rssFeedSourceId: string;
    originalId: string;
    title: string;
    summary: string | null;
    content: string | null;
    publishedAt: Date;
    thumbnailUrl: string | null;
    readonly created_at: Date;
}
export default FeaturedNews;
//# sourceMappingURL=FeaturedNews.d.ts.map