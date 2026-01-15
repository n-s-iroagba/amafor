import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database';

export interface MatchSummaryAttributes {
  id: number;
  fixtureId: number;
  summary: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MatchSummaryCreationAttributes extends Optional<MatchSummaryAttributes, 'id'> {}

class MatchSummary extends Model<MatchSummaryAttributes, MatchSummaryCreationAttributes> implements MatchSummaryAttributes {
  public id!: number;
  public fixtureId!: number;
  public summary!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MatchSummary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fixtureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fixtures',
        key: 'id',
      },
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: 'match_summaries',
  }
);

export default MatchSummary;