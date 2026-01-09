import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum ArticleTag {
  FOOTBALL_NEWS = 'football_news',
  MATCH_REPORT = 'match_report',
  ACADEMY_UPDATE = 'academy_update',
  PLAYER_SPOTLIGHT = 'player_spotlight',
  CLUB_ANNOUNCEMENT = 'club_announcement'
}

export enum ArticleStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface ArticleAttributes {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags: ArticleTag[];
  authorId: string;
  viewCount: number;
  readTime: number;
  videoEmbedUrl?: string;
  videoProvider?: string;
  status: ArticleStatus;
  scheduledPublishAt?: Date;
  publishedAt?: Date;
  adZones: any[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ArticleCreationAttributes extends Optional<ArticleAttributes, 'id' | 'createdAt' | 'updatedAt' | 'tags' | 'viewCount' | 'readTime' | 'status' | 'adZones' | 'metadata'> {}

export class Article extends Model<ArticleAttributes, ArticleCreationAttributes> implements ArticleAttributes {
  public id!: string;
  public title!: string;
  public content!: string;
  public excerpt?: string;
  public featuredImage?: string;
  public tags!: ArticleTag[];
  public authorId!: string;
  public viewCount!: number;
  public readTime!: number;
  public videoEmbedUrl?: string;
  public videoProvider?: string;
  public status!: ArticleStatus;
  public scheduledPublishAt?: Date;
  public publishedAt?: Date;
  public adZones!: any[];
  public metadata!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
  static associate(models: any) {
    Article.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  }

  static initModel(sequelize: Sequelize): typeof Article {
    Article.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        title: {
          type: DataTypes.STRING(500),
          allowNull: false
        },
        content: {
          type: DataTypes.TEXT('long'),
          allowNull: false
        },
        excerpt: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        featuredImage: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        tags: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: []
        },
        authorId: {
          type: DataTypes.UUID,
          allowNull: false
        },
        viewCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        readTime: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment: 'Estimated read time in minutes'
        },
        videoEmbedUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        videoProvider: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            isIn: [['youtube', 'vimeo']]
          }
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ArticleStatus)),
          allowNull: false,
          defaultValue: ArticleStatus.DRAFT
        },
        scheduledPublishAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        publishedAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        adZones: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: []
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        } ,createdAt: {
          type:DataTypes.DATE
        },
        updatedAt: {
          type:DataTypes.DATE
        }
      },
      {
        sequelize,
        tableName: 'articles',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['title'] },
          { fields: ['status'] },
          { fields: ['publishedAt'] },
          { fields: ['createdAt'] },
          { fields: ['authorId'] }
        ]
      }
    );

    return Article;
  }
}

export default Article;