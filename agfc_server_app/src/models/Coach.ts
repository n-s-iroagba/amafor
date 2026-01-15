// models/Coach.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database';

export interface CoachAttributes {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CoachCreationAttributes extends Optional<CoachAttributes, 'id'> {}

class Coach extends Model<CoachAttributes, CoachCreationAttributes> implements CoachAttributes {
  public id!: number;
  public name!: string;
  public role!: string;
  public imageUrl!: string;
  public bio!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Coach.init(
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'coaches',
    modelName: 'Coach',
  }
);

export default Coach;