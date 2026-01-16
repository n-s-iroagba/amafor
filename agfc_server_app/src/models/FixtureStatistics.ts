// models/FixtureStatistics.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface FixtureStatisticsAttributes {
  id: string;
  fixtureId: string;
  
  // Possession
  homePossession: number; // percentage (e.g., 55)
  awayPossession: number;

  // Shots
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;

  // Set Pieces
  homeCorners: number;
  awayCorners: number;
  
  // Discipline
  homeFouls: number;
  awayFouls: number;
  homeYellowCards: number;
  awayYellowCards: number;
  homeRedCards: number;
  awayRedCards: number;

  // Other
  homeOffsides: number;
  awayOffsides: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FixtureStatisticsCreationAttributes extends Optional<FixtureStatisticsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class FixtureStatistics extends Model<FixtureStatisticsAttributes, FixtureStatisticsCreationAttributes> implements FixtureStatisticsAttributes {
  public id!: string;
  public fixtureId!: string;
  
  public homePossession!: number;
  public awayPossession!: number;
  
  public homeShots!: number;
  public awayShots!: number;
  public homeShotsOnTarget!: number;
  public awayShotsOnTarget!: number;
  
  public homeCorners!: number;
  public awayCorners!: number;
  
  public homeFouls!: number;
  public awayFouls!: number;
  public homeYellowCards!: number;
  public awayYellowCards!: number;
  public homeRedCards!: number;
  public awayRedCards!: number;
  
  public homeOffsides!: number;
  public awayOffsides!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FixtureStatistics.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fixtureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fixtures',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    homePossession: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0, max: 100 }
    },
    awayPossession: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0, max: 100 }
    },
    homeShots: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayShots: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeShotsOnTarget: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayShotsOnTarget: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeCorners: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayCorners: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeFouls: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayFouls: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeYellowCards: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayYellowCards: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeRedCards: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayRedCards: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeOffsides: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayOffsides: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'fixture_statistics',
    timestamps: true
  }
);

export default FixtureStatistics;