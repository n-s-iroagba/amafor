// models/RssFeedSource.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export enum RssFeedSourceCategory {
  SPORTS = 'sports',
  GENERAL = 'general',
  BUSINESS= 'business',
  ENTERTAINMENT= 'entertainment',
  NIGERIA='nigeria',
}

export class RssFeedSource extends Model {
  public id!: number;
  public name!: string;
  public feedUrl!: string;
  public category!: RssFeedSourceCategory;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RssFeedSource.init({
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

}, {
  tableName: 'rss_feed_sources',
  sequelize,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});