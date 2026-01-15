import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database';

export interface GoalAttributes {
  id: number;
  fixtureId: number;
  scorer: string;
  minute: number;
  isPenalty: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GoalCreationAttributes extends Optional<GoalAttributes, 'id'> {}

class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: number;
  public fixtureId!: number;
  public scorer!: string;
  public minute!: number;
  public isPenalty!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Goal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fixtureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fixtures',
        key: 'id',
      },
    },
    scorer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isPenalty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'goals',
  }
);

export default Goal;