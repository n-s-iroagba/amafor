import sequelize from '../config/database';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';



export interface PatronSubscriptionAttributes {
  id: string;
  patronId: string;
  amount: number;
  startedAt: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  endDate?: Date,
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PatronSubscriptionCreationAttributes extends Optional<PatronSubscriptionAttributes, 'id' | 'createdAt' | 'endDate' | 'updatedAt' | 'metadata'> { }

export class PatronSubscription extends Model<PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes> implements PatronSubscriptionAttributes {
  public id!: string;
  public patronId!: string;
  public amount!: number;
  public startedAt!: Date;
  public nextBillingDate?: Date;
  public cancelledAt?: Date;

  public metadata!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
}


PatronSubscription.init(
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

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },


    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    nextBillingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
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



export default PatronSubscription;