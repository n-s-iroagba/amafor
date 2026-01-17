import { Model, CreationOptional, InferAttributes, InferCreationAttributes, Optional } from 'sequelize';
export interface AdCreativeAttributes {
    id: string;
    campaignId: string;
    zoneId: string;
    name: string;
    url: string;
    destinationUrl: string;
    type: string;
    format: string;
    dimensions: Record<string, any>;
    views: number;
    numberOfViews: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface AdCreativeCreationAttributes extends Optional<AdCreativeAttributes, 'id' | 'views' | 'numberOfViews' | 'created_at' | 'updated_at'> {
}
export declare class AdCreative extends Model<InferAttributes<AdCreative>, InferCreationAttributes<AdCreative>> implements AdCreativeAttributes {
    id: CreationOptional<string>;
    campaignId: string;
    zoneId: string;
    name: string;
    url: string;
    destinationUrl: string;
    type: string;
    format: string;
    dimensions: Record<string, any>;
    views: CreationOptional<number>;
    numberOfViews: CreationOptional<number>;
    created_at: CreationOptional<Date>;
    updated_at: CreationOptional<Date>;
}
export default AdCreative;
//# sourceMappingURL=AdCreative.d.ts.map