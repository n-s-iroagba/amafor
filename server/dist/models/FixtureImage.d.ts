import { Model, Optional } from 'sequelize';
export interface FixtureImageAttributes {
    id: string;
    fixtureId: string;
    imageUrl: string;
    caption?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface FixtureImageCreationAttributes extends Optional<FixtureImageAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class FixtureImage extends Model<FixtureImageAttributes, FixtureImageCreationAttributes> implements FixtureImageAttributes {
    id: string;
    fixtureId: string;
    imageUrl: string;
    caption?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default FixtureImage;
//# sourceMappingURL=FixtureImage.d.ts.map