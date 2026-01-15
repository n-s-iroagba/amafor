import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database';

export interface MatchImageAttributes {
  id: number;
  fixtureId: number;
  imageUrl: string;
  caption?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MatchImageCreationAttributes extends Optional<MatchImageAttributes, 'id'|'createdAt'|'updatedAt'> {}

class MatchImage extends Model<MatchImageAttributes, MatchImageCreationAttributes> implements MatchImageAttributes {
  public id!: number;
  public fixtureId!: number;
  public imageUrl!: string;
  public caption?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MatchImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fixtureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fixtures',
        key: 'id',
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'match_images',
  }
);

export default MatchImage;