// models/AdCreative.ts
import { 
  Model, 
  DataTypes, 
  CreationOptional, 
  InferAttributes, 
  InferCreationAttributes,
  Optional
} from 'sequelize';
import sequelize from '../config/database';

// 1. Define Attributes Interface
export interface AdCreativeAttributes {
  id: string;
  campaignId: string;
  zoneId: string;
  name: string;
  url: string;
  destinationUrl: string;
  type: string; // 'image' | 'video'
  format: string; // 'jpg', 'png', etc.
  dimensions: Record<string, any>;
  views: number;
  numberOfViews: number;
  created_at?: Date;
  updated_at?: Date;
}

// 2. Define Creation Attributes (id and timestamps are optional)
export interface AdCreativeCreationAttributes extends Optional<AdCreativeAttributes, 'id' | 'views' | 'numberOfViews' | 'created_at' | 'updated_at'> {}

// 3. Define Class with Sequelize Types
export class AdCreative extends Model<
  InferAttributes<AdCreative>,
  InferCreationAttributes<AdCreative>
> implements AdCreativeAttributes {
  declare id: CreationOptional<string>;
  declare campaignId: string;
  declare zoneId: string;
  declare name: string;
  declare url: string;
  declare destinationUrl: string;
  declare type: string;
  declare format: string;
  declare dimensions: Record<string, any>;
  declare views: CreationOptional<number>;
  declare numberOfViews: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

AdCreative.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    destinationUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['image', 'video']]
      }
    },
    format: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['jpg', 'png', 'mp4', 'gif']]
      }
    },
    dimensions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    numberOfViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: 'ad_creatives',
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['campaignId']
      },
      {
        fields: ['zoneId']
      },
      {
        fields: ['type']
      }
    ]
  }
);

export default AdCreative;