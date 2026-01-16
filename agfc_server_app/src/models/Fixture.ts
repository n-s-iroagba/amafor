// models/Fixture.ts
import sequelize from '../config/database';
import { DataTypes, Model, Optional } from 'sequelize';

export enum FixtureStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled'
}

export enum ArchiveStatus {
  PROCESSING = 'processing',
  AVAILABLE = 'available',
  FAILED = 'failed'
}

export interface FixtureAttributes {
  id: string;
  matchDate: Date;
  homeTeam: string;
  awayTeam: string;
  leagueId: string; // Ensure this exists here
  venue?: string;
  status: FixtureStatus;
  homeScore?: number;
  awayScore?: number;
  attendance?: number;
  referee?: string;
  weather?: string;
  matchReportArticleId?: string;
  highlightsUrl?: string;
  archiveStatus: ArchiveStatus;
  availableAt?: Date;
  videoUrl?: string;
  videoProvider?: string;
  metadata: Record<string, any>;
  createdById: string;
  updatedById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface FixtureCreationAttributes extends Optional<FixtureAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'archiveStatus' | 'metadata'> {}

export class Fixture extends Model<FixtureAttributes, FixtureCreationAttributes> implements FixtureAttributes {
  public id!: string;
  public matchDate!: Date;
  public homeTeam!: string;
  public awayTeam!: string;
  public leagueId!: string;
  public venue?: string;
  public status!: FixtureStatus;
  public homeScore?: number;
  public awayScore?: number;
  public attendance?: number;
  public referee?: string;
  public weather?: string;
  public matchReportArticleId?: string;
  public highlightsUrl?: string;
  public archiveStatus!: ArchiveStatus;
  public availableAt?: Date;
  public videoUrl?: string;
  public videoProvider?: string;
  public metadata!: Record<string, any>;
  public createdById!: string;
  public updatedById!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;
}

Fixture.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    matchDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    homeTeam: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    awayTeam: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    leagueId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'leagues',
        key: 'id',
      },
      onDelete: 'CASCADE'
    },
    venue: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(FixtureStatus)),
      allowNull: false,
      defaultValue: FixtureStatus.SCHEDULED
    },
    homeScore: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    awayScore: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    attendance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referee: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    weather: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    matchReportArticleId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    highlightsUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    archiveStatus: {
      type: DataTypes.ENUM(...Object.values(ArchiveStatus)),
      allowNull: false,
      defaultValue: ArchiveStatus.PROCESSING
    },
    availableAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    videoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    videoProvider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['youtube', 'vimeo']]
      }
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    createdById: {
      type: DataTypes.UUID
    },
    updatedById: {
      type: DataTypes.UUID
    }
  },
  {
    sequelize,
    tableName: 'fixtures',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['matchDate'] },
      { fields: ['status'] },
      { fields: ['leagueId'] }, // CORRECTED: Changed 'competition' to 'leagueId'
      { fields: ['createdAt'] }
    ]
  }
);

export default Fixture;