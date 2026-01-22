import { Model, Optional } from 'sequelize';
export interface FixtureImageAttributes {
    id: number;
    fixtureId: number;
    imageUrl: string;
    caption?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface FixtureImageCreationAttributes extends Optional<FixtureImageAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class FixtureImage extends Model<FixtureImageAttributes, FixtureImageCreationAttributes> implements FixtureImageAttributes {
    id: number;
    fixtureId: number;
    imageUrl: string;
    caption?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default FixtureImage;
//# sourceMappingURL=MatchImage.d.ts.map