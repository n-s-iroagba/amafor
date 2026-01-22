import sequelize from '../config/database';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { PatronTier, SubscriptionFrequency, SubscriptionStatus } from './PatronSubscription';




export interface PatronSubscriptionPackageAttributes {
  id: string;
  patronId: string;
  tier: PatronTier;
  frequency: SubscriptionFrequency;
  miniumumAmount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PatronSubscriptionPackageCreationAttributes extends Optional<PatronSubscriptionPackageAttributes, 'id' | 'createdAt' | 'updatedAt' > {}

export class PatronSubscriptionPackage extends Model<PatronSubscriptionPackageAttributes, PatronSubscriptionPackageCreationAttributes> implements PatronSubscriptionPackageAttributes {
  public id!: string;
  public patronId!: string;
  public tier!: PatronTier;
  public frequency!: SubscriptionFrequency;
  public miniumumAmount!: number;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
  }


    PatronSubscriptionPackage.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        patronId: {
          type: DataTypes.UUID,
          allowNull: false
        },
        tier: {
          type: DataTypes.ENUM(...Object.values(PatronTier)),
          allowNull: false
        },
        frequency: {
          type: DataTypes.ENUM(...Object.values(SubscriptionFrequency)),
          allowNull: false
        },
        miniumumAmount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false
        },
   
        createdAt: {
          type:DataTypes.DATE
        },
        updatedAt: {
          type:DataTypes.DATE
        }
      },
      {
        sequelize,
        tableName: 'patron_subscriptions',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['patronId'] },
          { fields: ['tier'] },
          { fields: ['status'] },
          { fields: ['frequency'] },
          { fields: ['createdAt'] }
        ]
      }
    );



export default PatronSubscriptionPackage;