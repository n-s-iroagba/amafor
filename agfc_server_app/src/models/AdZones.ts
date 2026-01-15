// models/AdZone.ts
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,

} from 'sequelize';
import sequelize from '../config/database';
import logger from '@utils/logger';

export enum AdZone {
  HOMEPAGE_BANNER = 'homepage_banner',
  TOP_PAGE_BANNER = 'top_page_banner',
  SIDEBAR = 'sidebar',
  ARTICLE_FOOTER = 'article_footer',
  MID_ARTICLE = 'mid_article'
}

export enum AdZoneStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

export enum AdZoneType {
  BANNER = 'banner',
  SIDEBAR = 'sidebar',
  INLINE = 'inline',
  FOOTER = 'footer'
}

// Interface for attributes
export interface AdZoneAttributes {
  id: string;
  name: string;
  zone: AdZone;
  description: string | null;
  pricePerView: number; // Price in kobo/cent per view
  type: AdZoneType;
  dimensions: string; // e.g., "728x90", "300x250", "160x600"
  maxAds: number; // Maximum number of ads that can run concurrently
  status: AdZoneStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creation attributes
export type AdZoneCreationAttributes = Omit<
  AdZoneAttributes,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Interface for update attributes (only pricePerView is updatable)
export type AdZoneUpdateAttributes = Pick<AdZoneAttributes, 'pricePerView'>;

// Main AdZone model
export class AdZoneModel extends Model<
  InferAttributes<AdZoneModel>,
  InferCreationAttributes<AdZoneModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare zone: AdZone;
  declare description: CreationOptional<string | null>;
  declare pricePerView: number;
  declare type: AdZoneType;
  declare dimensions: string;
  declare maxAds: number;
  declare status: AdZoneStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance methods
  getFormattedPrice(): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(this.pricePerView / 100); // Convert from kobo to Naira
  }

  isAvailable(): boolean {
    return this.status === AdZoneStatus.ACTIVE;
  }

  // Static methods
  static async findByZone(zone: AdZone): Promise<AdZoneModel | null> {
    return await this.findOne({ where: { zone } });
  }

  static async getActiveZones(): Promise<AdZoneModel[]> {
    return await this.findAll({
      where: { status: AdZoneStatus.ACTIVE },
      order: [['pricePerView', 'ASC']]
    });
  }

  static async getZonePrice(zone: AdZone): Promise<number | null> {
    const adZone = await this.findByZone(zone);
    return adZone ? adZone.pricePerView : null;
  }

  static async updateZonePrice(zone: AdZone, pricePerView: number): Promise<boolean> {
    try {
      const [affectedCount] = await this.update(
        { pricePerView },
        { where: { zone } }
      );
      return affectedCount > 0;
    } catch (error) {
      logger.error('Failed to update zone price', { zone, pricePerView, error });
      return false;
    }
  }
}

// Model initialization
AdZoneModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    zone: {
      type: DataTypes.ENUM(...Object.values(AdZone)),
      allowNull: false,
      unique: true,
      validate: {
        isIn: [Object.values(AdZone)]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    pricePerView: {
      type: DataTypes.INTEGER, // Store in smallest unit (kobo/cent)
      allowNull: false,
      validate: {
        min: 1, // Minimum 1 kobo per view
        isInt: true
      },
      field: 'price_per_view'
    },
    type: {
      type: DataTypes.ENUM(...Object.values(AdZoneType)),
      allowNull: false,
      validate: {
        isIn: [Object.values(AdZoneType)]
      }
    },
    dimensions: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\d+x\d+$/ // Format: "widthxheight"
      }
    },
    maxAds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10
      },
      field: 'max_ads'
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AdZoneStatus)),
      allowNull: false,
      defaultValue: AdZoneStatus.ACTIVE,
      validate: {
        isIn: [Object.values(AdZoneStatus)]
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  },
  {
    tableName: 'ad_zones',
    sequelize,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      { unique: true, fields: ['zone'] },
      { unique: true, fields: ['name'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['price_per_view'] }
    ],
    hooks: {
      beforeUpdate: (instance: AdZoneModel) => {
        // Only allow pricePerView to be updated
        const changedFields = instance.changed();
        if (changedFields && changedFields.length > 0) {
          const allowedFields = ['pricePerView', 'updatedAt'];
          const hasInvalidChanges = changedFields.some(
            field => !allowedFields.includes(field)
          );
          
          if (hasInvalidChanges) {
            throw new Error('Only pricePerView can be updated');
          }
        }
      }
    }
  }
);

export default AdZoneModel;