import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum AdZone {
  HOMEPAGE_BANNER = 'homepage_banner',
  TOP_PAGE_BANNER = 'top_page_banner',
  SIDEBAR = 'sidebar',
  ARTICLE_FOOTER = 'article_footer',
  MID_ARTICLE = 'mid_article'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export interface AdCampaignAttributes {
  id: string;
  name: string;
  advertiserId: string;
  
  status: CampaignStatus;
  budget: number;
  spent: number;
  targeting:string[]
  viewsDelivered: number;
  uniqueViews: number;

  paymentStatus: PaymentStatus;
  paymentReference?: string;
  cpv: number;
  startDate?: Date;
  endDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AdCampaignCreationAttributes extends Optional<AdCampaignAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'spent' | 'viewsDelivered' | 'uniqueViews' | 'paymentStatus' | 'cpv' | 'metadata'> {}

export class AdCampaign extends Model<AdCampaignAttributes, AdCampaignCreationAttributes> implements AdCampaignAttributes {
  public id!: string;
  public name!: string;
  public advertiserId!: string;

  public status!: CampaignStatus;
  public budget!: number;
  public spent!: number;

  public viewsDelivered!: number;
  public uniqueViews!: number;
  public targeting!:string[]
  public paymentStatus!: PaymentStatus;
  public paymentReference?: string;
  public cpv!: number;
  public startDate?: Date;
  public endDate?: Date;
  public metadata!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
  static associate(models: any) {
    AdCampaign.belongsTo(models.User, { foreignKey: 'advertiserId', as: 'advertiser' });
  }

  static initModel(sequelize: Sequelize): typeof AdCampaign {
    AdCampaign.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING(200),
          allowNull: false
        },
        advertiserId: {
          type: DataTypes.UUID,
          allowNull: false
        },
     
        status: {
          type: DataTypes.ENUM(...Object.values(CampaignStatus)),
          allowNull: false,
          defaultValue: CampaignStatus.DRAFT
        },
        budget: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0
        },
        spent: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0
        },
       viewsDelivered: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        uniqueViews: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
     
  
        targeting: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        },
        paymentStatus: {
          type: DataTypes.ENUM(...Object.values(PaymentStatus)),
          allowNull: false,
          defaultValue: PaymentStatus.PENDING
        },
        paymentReference: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        cpv: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: true
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        }        ,createdAt: {
          type:DataTypes.DATE
        },
        updatedAt: {
          type:DataTypes.DATE
        }
      },
      {
        sequelize,
        tableName: 'ad_campaigns',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['advertiserId'] },
          { fields: ['status'] },
          { fields: ['zone'] },
          { fields: ['paymentStatus'] },
          { fields: ['createdAt'] }
        ]
      }
    );

    return AdCampaign;
  }
}

export default AdCampaign;