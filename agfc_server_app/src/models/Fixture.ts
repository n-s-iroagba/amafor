import sequelize from '@config/database';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

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
  competition: string;
  venue?: string;
  status: FixtureStatus;
  homeScore?: number;
  awayScore?: number;
  attendance?: number;
  referee?: string;
  weather?: string;
  matchReportArticleId?: string;
  lineupHome: any;
  lineupAway: any;
  stats: any;
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

export interface FixtureCreationAttributes extends Optional<FixtureAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'lineupHome' | 'lineupAway' | 'stats' | 'archiveStatus'  | 'metadata'> {}

export class Fixture extends Model<FixtureAttributes, FixtureCreationAttributes> implements FixtureAttributes {
  public id!: string;
  public matchDate!: Date;
  public homeTeam!: string;
  public awayTeam!: string;
  public competition!: string;
  public venue?: string;
  public status!: FixtureStatus;
  public homeScore?: number;
  public awayScore?: number;
  public attendance?: number;
  public referee?: string;
  public weather?: string;
  public matchReportArticleId?: string;
  public lineupHome!: any;
  public lineupAway!: any;
  public stats!: any;
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
    competition: {
      type: DataTypes.STRING(200),
      allowNull: false
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
    lineupHome: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    lineupAway: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    stats: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
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
    sequelize,  // This comes from the import at the top
    tableName: 'fixtures',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['matchDate'] },
      { fields: ['status'] },
      { fields: ['competition'] },
      { fields: ['createdAt'] }
    ]
  }
);
export default Fixture;