// models/RssFeedSource.ts (Simplified)
import { 
  Model, 
  DataTypes, 
  CreationOptional, 
  InferAttributes, 
  InferCreationAttributes 
} from 'sequelize';
import sequelize from '../config/database';

export enum RssFeedSourceCategory {
  SPORTS = 'sports',
  GENERAL = 'general',
  BUSINESS = 'business',
  ENTERTAINMENT = 'entertainment',
  NIGERIA = 'nigeria',
}

export class RssFeedSource extends Model<
  InferAttributes<RssFeedSource>,
  InferCreationAttributes<RssFeedSource>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare feedUrl: string;
  declare category: RssFeedSourceCategory;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Export types for use in repositories and seeders
export type RssFeedSourceAttributes = InferAttributes<RssFeedSource>;
export type RssFeedSourceCreationAttributes = InferCreationAttributes<RssFeedSource>;

RssFeedSource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    feedUrl: {
      type: DataTypes.STRING(500),
      unique: true,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    category: {
      type: DataTypes.ENUM(...Object.values(RssFeedSourceCategory)),
      allowNull: false
    },
    createdAt: '',
    updatedAt: ''
  },
  {
    tableName: 'rss_feed_sources',
    sequelize,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

export default RssFeedSource;