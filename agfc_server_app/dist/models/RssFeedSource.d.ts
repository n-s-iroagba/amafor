import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
export declare enum RssFeedSourceCategory {
    SPORTS = "sports",
    GENERAL = "general",
    BUSINESS = "business",
    ENTERTAINMENT = "entertainment",
    NIGERIA = "nigeria"
}
export declare class RssFeedSource extends Model<InferAttributes<RssFeedSource>, InferCreationAttributes<RssFeedSource>> {
    id: CreationOptional<number>;
    name: string;
    feedUrl: string;
    category: RssFeedSourceCategory;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
export declare type RssFeedSourceAttributes = InferAttributes<RssFeedSource>;
export declare type RssFeedSourceCreationAttributes = InferCreationAttributes<RssFeedSource>;
export default RssFeedSource;
//# sourceMappingURL=RssFeedSource.d.ts.map