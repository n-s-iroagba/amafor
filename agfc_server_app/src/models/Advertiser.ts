// models/Advertiser.ts
import { Model, DataTypes } from 'sequelize';
import  sequelize  from '../config/database';


export class Advertiser extends Model {
  public id!: number;
  public companyName!: string;
  public contactName!: string;
  public contactEmail!: string;
  public contactPhone!: string;
  public userId!: number ;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Advertiser.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Use UUIDV4 for UUID generation
      primaryKey: true,
    },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contactName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'advertisers',
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
export default Advertiser