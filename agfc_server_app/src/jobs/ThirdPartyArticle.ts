import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { RssFeedSource } from './RssFeedSource';

// 1️⃣ Define all attributes that exist in the DB
export interface ThirdPartyArticleAttributes {
  id: number;
  rss_feed_source_id: number;
  original_id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  article_url: string;
  published_at: Date;
  thumbnail_url?: string | null;
  created_at?: Date;
}

// 2️⃣ Define creation attributes (id is optional)
export type ThirdPartyArticleCreationAttributes = Optional<
  ThirdPartyArticleAttributes,
  'id' | 'created_at'
>;

// 3️⃣ Define the model class
export class ThirdPartyArticle
  extends Model<ThirdPartyArticleAttributes, ThirdPartyArticleCreationAttributes>
  implements ThirdPartyArticleAttributes
{
  public id!: number;
  public rss_feed_source_id!: number;
  public original_id!: string;
  public title!: string;
  public summary!: string | null;
  public content!: string | null;
  public article_url!: string;
  public published_at!: Date;
  public thumbnail_url!: string | null;
  public readonly created_at!: Date;
}

// 4️⃣ Initialize the model
ThirdPartyArticle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rss_feed_source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: RssFeedSource,
        key: 'id',
      },
    },
    original_id: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    article_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    
    },
  },
  {
    tableName: 'third_party_articles',
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['rss_feed_source_id', 'original_id'],
      },
      {
        fields: ['published_at'],
      },
    ],
  }
);

// 5️⃣ Define associations
ThirdPartyArticle.belongsTo(RssFeedSource, {
  foreignKey: 'rss_feed_source_id',
  as: 'feed_source',
});
