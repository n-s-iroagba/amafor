// models/AdZone.ts
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';



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
  id: string; // Changed to allow string IDs like 'TP_BAN'
  name: string;

  description: string | null;
  pricePerView: number;
  type: AdZoneType;
  dimensions: string;
  maxSize: string; // Added: e.g., "2MB"
  tags: string[]; // Added: e.g., ['sports', 'tech']

  status: AdZoneStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creation attributes
export type AdZoneCreationAttributes = Omit<
  AdZoneAttributes,
  'createdAt' | 'updatedAt'
> & {
  createdAt?: Date;
  updatedAt?: Date;
};

// Main AdZone model
export class AdZoneModel extends Model<
  InferAttributes<AdZoneModel>,
  InferCreationAttributes<AdZoneModel>
> {
  declare id: string; // Not auto-generated UUID anymore
  declare name: string;

  declare description: CreationOptional<string | null>;
  declare pricePerView: number;
  declare type: AdZoneType;
  declare dimensions: string;
  declare maxSize: string;
  declare tags: string[];

  declare status: AdZoneStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance methods and Static methods remain the same...
  getFormattedPrice(): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(this.pricePerView / 100);
  }
}

// Model initialization
AdZoneModel.init(
  {
    id: {
      type: DataTypes.STRING(50), // Changed from UUIDV4 to STRING
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pricePerView: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'price_per_view'
    },
    type: {
      type: DataTypes.ENUM(...Object.values(AdZoneType)),
      allowNull: false,
    },
    dimensions: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    maxSize: {
      type: DataTypes.STRING(10), // Added
      allowNull: false,
      defaultValue: '1MB',
      field: 'max_size'
    },
    tags: {
      type: DataTypes.JSON, // Added
      allowNull: false,
      defaultValue: []
    },
  
    status: {
      type: DataTypes.ENUM(...Object.values(AdZoneStatus)),
      allowNull: false,
      defaultValue: AdZoneStatus.ACTIVE,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
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
    // ... indexes
  }
);

export default AdZoneModel;


