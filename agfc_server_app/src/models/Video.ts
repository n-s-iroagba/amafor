// models/Video.ts
import { DataTypes, Model, Optional, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

export interface VideoAttributes {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  videoUrl: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VideoCreationAttributes extends Optional<VideoAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Video extends Model<InferAttributes<Video>, InferCreationAttributes<Video>> implements VideoAttributes {
  declare id: CreationOptional<number>;
  declare title: string;
  declare excerpt: string;
  declare thumbnail: string;
  declare videoUrl: string;
  declare duration: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
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
    tableName: 'videos',
  
  }
);

export default Video;