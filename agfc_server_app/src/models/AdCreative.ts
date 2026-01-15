// models/AdCreative.ts (Corrected)
import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelize from '../config/database';

export class AdCreative extends Model<
  InferAttributes<AdCreative>,
  InferCreationAttributes<AdCreative>
> {
  declare id: CreationOptional<string>;
  declare campaignId: string;
  declare numberOfViews: number;
  declare name: string;
  declare url: string;
  declare views: number;
  declare destinationUrl: string;
  declare zoneId: string;
  declare type: string;
  declare dimensions: Record<string, any>; // Changed to proper type
  declare format: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

AdCreative.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Use UUIDV4 for UUID generation
      primaryKey: true,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Remove autoIncrement here
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    numberOfViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT, // Use TEXT for URLs which can be long
      allowNull: false,
    },
    destinationUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    // Add indexes for better performance
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