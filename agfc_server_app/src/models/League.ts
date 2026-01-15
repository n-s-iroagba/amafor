import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';

export interface LeagueAttributes {
  id: string;
  name: string;
  season: string;
  isFriendly: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeagueCreationAttributes extends Optional<LeagueAttributes, 'id'> {}

class League extends Model<LeagueAttributes, LeagueCreationAttributes> implements LeagueAttributes {
  public id!: string;
  public name!: string;
  public season!: string;
  public isFriendly!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

League.init(
  {
     id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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