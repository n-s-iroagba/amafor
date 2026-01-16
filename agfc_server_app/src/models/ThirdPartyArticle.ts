import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';


// 1️⃣ Define all attributes that exist in the DB
export interface ThirdPartyArticleAttributes {
  id: number;
  rssFeedSourceId: number;
  originalId: string;
  title: string;
  summary?: string | null;
  content?: string | null;

  publishedAt: Date;
  thumbnailUrl?: string | null;
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
  public rssFeedSourceId!: number;
  public originalId!: string;
  public title!: string;
  public summary!: string | null;
  public content!: string | null;

  public publishedAt!: Date;
  public thumbnailUrl!: string | null;
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
    rssFeedSourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rss_feed_sources',
        key: 'id',
      },
    },
    originalId: {
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

    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    thumbnailUrl: {
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
        fields: ['rssFeedSourceId', 'originalId'],
      },
      {
        fields: ['publishedAt'],
      },
    ],
  }
);

export default ThirdPartyArticle
