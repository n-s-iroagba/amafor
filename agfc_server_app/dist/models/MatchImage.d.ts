import { Model, Optional } from 'sequelize';
export interface MatchImageAttributes {
    id: number;
    fixtureId: number;
    imageUrl: string;
    caption?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface MatchImageCreationAttributes extends Optional<MatchImageAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class MatchImage extends Model<MatchImageAttributes, MatchImageCreationAttributes> implements MatchImageAttributes {
    id: number;
    fixtureId: number;
    imageUrl: string;
    caption?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default MatchImage;
//# sourceMappingURL=MatchImage.d.ts.map