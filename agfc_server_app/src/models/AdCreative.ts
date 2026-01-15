// models/AdCreative.ts (Simplified)
import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelize from '../config/database';
import AdCampaign from './AdCampaign';

// Simple model without complex interfaces
export class AdCreative extends Model<
  InferAttributes<AdCreative>,
  InferCreationAttributes<AdCreative>
> {
  declare id: CreationOptional<string>;
  declare campaignId: string;
  declare numberOfViews: number;
  declare name: string;
  declare url: string;
  declare views:number
  declare destinationUrl: string;
  declare zoneId:string
    declare type:string
  declare dimensions: string;
  declare format:string
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

// Export types for use in repositories/seeders
export type AdCreativeAttributes = InferAttributes<AdCreative>;
export type AdCreativeCreationAttributes = InferCreationAttributes<AdCreative>;

AdCreative.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    views: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AdCampaign,
        key: 'id',
      },
    },
       zoneId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AdCampaign,
        key: 'id',
      },
    },
    numberOfViews: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
                isIn: [['jpg', 'png', 'mp4']]
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    destinationUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    created_at: '',
    updated_at: ''
  },
  {
    tableName: 'ad_creatives',
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdCreative;