// models/Advertiser.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AdvertiserAttributes {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  address?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdvertiserCreationAttributes extends Optional<AdvertiserAttributes, 'id' | 'phone' | 'website' | 'industry' | 'address' | 'status' | 'createdAt' | 'updatedAt'> {}

class Advertiser extends Model<AdvertiserAttributes, AdvertiserCreationAttributes> implements AdvertiserAttributes {
  public id!: string;
  public companyName!: string;
  public contactPerson!: string;
  public email!: string;
  public phone?: string;
  public website?: string;
  public industry?: string;
  public address?: string;
  public status!: 'active' | 'inactive' | 'suspended';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Advertiser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    contactPerson: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'advertisers',
    modelName: 'Advertiser',
    indexes: [
      { fields: ['email'] },
      { fields: ['status'] }
    ]
  }
);

export default Advertiser;