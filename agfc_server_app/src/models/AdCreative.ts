// models/AdCreative.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import AdCampaign from './AdCampaign';


export class AdCreative extends Model {
  public id!: number;
  public campaignId!: number;   // ✅ match field name in init
  public numberOfViews!:number
  public name!: string;
  public url!:string
  public destinationUrl!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

AdCreative.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.INTEGER,
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
 
  },
  {
    tableName: 'ad_creatives',
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);


