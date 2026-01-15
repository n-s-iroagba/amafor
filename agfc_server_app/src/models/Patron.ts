// models/Patron.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database';

export interface PatronAttributes {
  id: string;
  name: string;
email: string;
phoneNumber:string
  imageUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatronCreationAttributes extends Optional<PatronAttributes, 'id'> {}

class Patron extends Model<PatronAttributes, PatronCreationAttributes> implements PatronAttributes {
  public id!: string;
  public name!: string;
    public email!: string;
       public phoneNumber!: string;
  public position!: string;
  public imageUrl!: string;
  public bio!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patron.init(
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
  email: {
      type: DataTypes.STRING,
      allowNull: false,
    },phoneNumber: {
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
    tableName: 'patrons',
    modelName: 'Patron',
  }
);

export default Patron;