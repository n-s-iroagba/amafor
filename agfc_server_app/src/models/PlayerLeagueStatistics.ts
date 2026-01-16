import sequelize from '@config/database';
import { DataTypes, Model, Optional } from 'sequelize';



export interface PlayerLeagueStatisticsAttributes {
  id: string;
  playerId: string;
  leagueId:string;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;

  createdById: string;
  updatedById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PlayerLeagueStatisticsCreationAttributes extends Optional<PlayerLeagueStatisticsAttributes, 'id' | 'createdAt' | 'updatedAt'  | 'assists' | 'cleanSheets' | 'yellowCards' | 'redCards' | 'minutesPlayed' > {}

export class PlayerLeagueStatistics extends Model<PlayerLeagueStatisticsAttributes,  PlayerLeagueStatisticsCreationAttributes> implements PlayerLeagueStatisticsAttributes {
  public id!: string;
  public playerId!: string;
  public leagueId!: string;
  public goals!: number;
  public assists!: number;
  public cleanSheets!: number;
  public yellowCards!: number;
  public redCards!: number;
  public minutesPlayed!: number;
  public createdById!: string;
  public updatedById!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;


}
    PlayerLeagueStatistics.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
   leagueId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'leagues',
        key: 'id',
      },
    
      onDelete: 'CASCADE'
    },    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'players',
        key: 'id',
      },
    
      onDelete: 'CASCADE'
    },
    
   
      
        assists: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        cleanSheets: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        yellowCards: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        redCards: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        minutesPlayed: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
       createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
            createdById: {
          type:DataTypes.UUID
        },
        updatedById: {
          type:DataTypes.UUID
        }
      },
      {
        sequelize,
        tableName: 'player_league_statistics',
        timestamps: true,
    
      }
    );



export default PlayerLeagueStatistics;