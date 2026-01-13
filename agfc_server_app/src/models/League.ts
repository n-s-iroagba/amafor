import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';

interface LeagueAttributes {
  id: number;
  name: string;
  season: string;
  isFriendly: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeagueCreationAttributes extends Optional<LeagueAttributes, 'id'> {}

class League extends Model<LeagueAttributes, LeagueCreationAttributes> implements LeagueAttributes {
  public id!: number;
  public name!: string;
  public season!: string;
  public isFriendly!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

League.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    season: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isFriendly: {
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
    tableName: 'leagues',
  }
);

export default League;