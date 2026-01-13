import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum PlayerPosition {
  GK = 'GK',
  DF = 'DF',
  MF = 'MF',
  FW = 'FW'
}

export enum PlayerStatus {
  ACTIVE = 'active',
  INJURED = 'injured',
  SUSPENDED = 'suspended',
  TRANSFERRED = 'transferred'
}

export interface PlayerAttributes {
  id: string;
  name: string;
  dateOfBirth: Date;
  position: PlayerPosition;
  height?: number;
  nationality?: string;
  biography?: string;
  jerseyNumber?: number;
  imageUrl?: string;
  status: PlayerStatus;
  joinedDate?: Date;
  previousClubs: string[];
  contactEmail?: string;
  contactPhone?: string;
  agentName?: string;
  agentContact?: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  metadata: Record<string, any>;
  createdById: string;
  updatedById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PlayerCreationAttributes extends Optional<PlayerAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'previousClubs' | 'appearances' | 'goals' | 'assists' | 'cleanSheets' | 'yellowCards' | 'redCards' | 'minutesPlayed' | 'metadata'> {}

export class Player extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
  public id!: string;
  public name!: string;
  public dateOfBirth!: Date;
  public position!: PlayerPosition;
  public height?: number;
  public nationality?: string;
  public biography?: string;
  public jerseyNumber?: number;
  public imageUrl?: string;
  public status!: PlayerStatus;
  public joinedDate?: Date;
  public previousClubs!: string[];
  public contactEmail?: string;
  public contactPhone?: string;
  public agentName?: string;
  public agentContact?: string;
  public appearances!: number;
  public goals!: number;
  public assists!: number;
  public cleanSheets!: number;
  public yellowCards!: number;
  public redCards!: number;
  public minutesPlayed!: number;
  public metadata!: Record<string, any>;
  public createdById!: string;
  public updatedById!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;

  // Associations
  static associate(models: any) {
    Player.belongsTo(models.User, { foreignKey: 'createdById', as: 'createdBy' });
    Player.belongsTo(models.User, { foreignKey: 'updatedById', as: 'updatedBy' });
  }

  static initModel(sequelize: Sequelize): typeof Player {
    Player.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING(200),
          allowNull: false
        },
        dateOfBirth: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        position: {
          type: DataTypes.ENUM(...Object.values(PlayerPosition)),
          allowNull: false
        },
        height: {
          type: DataTypes.DECIMAL(3, 2),
          allowNull: true,
          comment: 'Height in meters'
        },
        nationality: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        biography: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        jerseyNumber: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 1,
            max: 99
          }
        },
        imageUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        status: {
          type: DataTypes.ENUM(...Object.values(PlayerStatus)),
          allowNull: false,
          defaultValue: PlayerStatus.ACTIVE
        },
        joinedDate: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        previousClubs: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: []
        },
        contactEmail: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            isEmail: true
          }
        },
        contactPhone: {
          type: DataTypes.STRING(20),
          allowNull: true
        },
        agentName: {
          type: DataTypes.STRING(200),
          allowNull: true
        },
        agentContact: {
          type: DataTypes.STRING(200),
          allowNull: true
        },
        appearances: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        goals: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
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
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {}
        }, createdAt: {
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
        tableName: 'players',
        timestamps: true,
        paranoid: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['position'] },
          { fields: ['status'] },
          { fields: ['createdAt'] }
        ]
      }
    );

    return Player;
  }
}

export default Player;