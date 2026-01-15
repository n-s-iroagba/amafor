import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database';

export interface LineupAttributes {
  id: number;
  fixtureId: number;
  playerId: number;
  position: string;
  isStarter: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LineupCreationAttributes extends Optional<LineupAttributes, 'id'> {}

class Lineup extends Model<LineupAttributes, LineupCreationAttributes> implements LineupAttributes {
  public id!: number;
  public fixtureId!: number;
  public playerId!: number;
  public position!: string;
  public isStarter!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lineup.init(
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
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
        model: 'players',
        key: 'id',
      },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isStarter: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'lineups',
  }
);

export default Lineup;