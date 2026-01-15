import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';



// Define attributes
export interface LeagueStatisticsAttributes {
  id: string;
  leagueId: string;
  team: string;
  goalsFor: number;
  goalsAgainst: number;
  fixtureId?: number;
  matchesPlayed?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  points?: number;
  goalDifference?: number;
  homeGoalsFor?: number;
  homeGoalsAgainst?: number;
  awayGoalsFor?: number;
  awayGoalsAgainst?: number;
  form?: string; // Last 5 matches form (e.g., "WWDLW")
  cleanSheets?: number;
  failedToScore?: number;
  avgGoalsPerMatch?: number;
  avgGoalsConcededPerMatch?: number;
  lastMatchDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes
export interface LeagueStatisticsCreationAttributes extends Optional<
  LeagueStatisticsAttributes, 
  'id' | 'matchesPlayed' | 'wins' | 'draws' | 'losses' | 'points' | 
  'goalDifference' | 'homeGoalsFor' | 'homeGoalsAgainst' | 'awayGoalsFor' | 
  'awayGoalsAgainst' | 'form' | 'cleanSheets' | 'failedToScore' | 
  'avgGoalsPerMatch' | 'avgGoalsConcededPerMatch' | 'lastMatchDate'
> {}

export class LeagueStatistics extends Model<
  LeagueStatisticsAttributes, 
  LeagueStatisticsCreationAttributes
> implements LeagueStatisticsAttributes {
  public id!: string;
  public leagueId!: string;
  public team!: string;
  public goalsFor!: number;
  public goalsAgainst!: number;
  public fixtureId?: number;
  public matchesPlayed?: number;
  public wins?: number;
  public draws?: number;
  public losses?: number;
  public points?: number;
  public goalDifference?: number;
  public homeGoalsFor?: number;
  public homeGoalsAgainst?: number;
  public awayGoalsFor?: number;
  public awayGoalsAgainst?: number;
  public form?: string;
  public cleanSheets?: number;
  public failedToScore?: number;
  public avgGoalsPerMatch?: number;
  public avgGoalsConcededPerMatch?: number;
  public lastMatchDate?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


}

LeagueStatistics.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    leagueId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'leagues',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    team: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goalsFor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    goalsAgainst: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    fixtureId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fixtures',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    matchesPlayed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    wins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    draws: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    losses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    goalDifference: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    homeGoalsFor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    homeGoalsAgainst: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    awayGoalsFor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    awayGoalsAgainst: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    form: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        len: [0, 5],
        is: /^[WDL]*$/i, // Only W (Win), D (Draw), L (Loss)
      },
    },
    cleanSheets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    failedToScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    avgGoalsPerMatch: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    avgGoalsConcededPerMatch: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    lastMatchDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'league_statistics',
    timestamps: true,
    indexes: [
      {
        name: 'league_statistics_leagueId_index',
        fields: ['leagueId'],
      },
      {
        name: 'league_statistics_team_index',
        fields: ['team'],
      },
      {
        name: 'league_statistics_league_team_index',
        fields: ['leagueId', 'team'],
        unique: true,
      },
      {
        name: 'league_statistics_points_index',
        fields: ['points'],
      },
      {
        name: 'league_statistics_goal_difference_index',
        fields: ['goalDifference'],
      },
    ],
    hooks: {
      beforeValidate: (statistic: LeagueStatistics) => {
        // Calculate goal difference
        statistic.goalDifference = statistic.goalsFor - statistic.goalsAgainst;
        
        // Calculate points (3 for win, 1 for draw)
        statistic.points = (statistic.wins || 0) * 3 + (statistic.draws || 0);
        
        // Calculate matches played if not provided
        if (!statistic.matchesPlayed) {
          statistic.matchesPlayed = 
            (statistic.wins || 0) + 
            (statistic.draws || 0) + 
            (statistic.losses || 0);
        }
        
        // Calculate averages if matches played > 0
        if (statistic.matchesPlayed > 0) {
          statistic.avgGoalsPerMatch = Number(
            (statistic.goalsFor / statistic.matchesPlayed).toFixed(2)
          );
          statistic.avgGoalsConcededPerMatch = Number(
            (statistic.goalsAgainst / statistic.matchesPlayed).toFixed(2)
          );
        }
      },
    },
  }
);

export default LeagueStatistics;