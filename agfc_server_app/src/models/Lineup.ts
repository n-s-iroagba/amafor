// models/Lineup.ts
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import sequelize from '../config/database';
import { Fixture } from './Fixture';
import { Player } from './Player';

// Interface for attributes
export interface LineupAttributes {
  id: string;
  fixtureId: string;
  playerId: string;
  position: string;
  isStarter: boolean;
  jerseyNumber?: number | null;
  captain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creation attributes
export type LineupCreationAttributes = Omit<
  LineupAttributes,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Main Lineup model
export class Lineup extends Model<
  InferAttributes<Lineup>,
  InferCreationAttributes<Lineup>
> {
  declare id: CreationOptional<string>;
  declare fixtureId: ForeignKey<Fixture['id']>;
  declare playerId: ForeignKey<Player['id']>;
  declare position: string;
  declare isStarter: boolean;
  declare jerseyNumber: CreationOptional<number | null>;
  declare captain: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Associations
  declare fixture?: NonAttribute<Fixture>;
  declare player?: NonAttribute<Player>;

  // Instance methods
  isCaptain(): boolean {
    return this.captain;
  }

  isSubstitute(): boolean {
    return !this.isStarter;
  }

  getPositionCategory(): string {
    const positionMap: Record<string, string> = {
      'GK': 'Goalkeeper',
      'RB': 'Defender',
      'CB': 'Defender',
      'LB': 'Defender',
      'RWB': 'Defender',
      'LWB': 'Defender',
      'CDM': 'Midfielder',
      'CM': 'Midfielder',
      'CAM': 'Midfielder',
      'RM': 'Midfielder',
      'LM': 'Midfielder',
      'RW': 'Forward',
      'LW': 'Forward',
      'CF': 'Forward',
      'ST': 'Forward'
    };
    
    return positionMap[this.position] || 'Unknown';
  }

  // Static methods
  static async getFixtureLineup(fixtureId: string): Promise<Lineup[]> {
    return await this.findAll({
      where: { fixtureId },
      order: [
        ['isStarter', 'DESC'],
        ['position', 'ASC'],
        ['jerseyNumber', 'ASC']
      ]
    });
  }

  static async getPlayerFixtures(playerId: string): Promise<Lineup[]> {
    return await this.findAll({
      where: { playerId },
      order: [['createdAt', 'DESC']]
    });
  }
}

// Model initialization
Lineup.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fixtureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fixtures',
        key: 'id',
      },
      field: 'fixture_id',
      onDelete: 'CASCADE'
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'players',
        key: 'id',
      },
      field: 'player_id',
      onDelete: 'CASCADE'
    },
    position: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['GK', 'RB', 'CB', 'LB', 'RWB', 'LWB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'CF', 'ST']]
      }
    },
    isStarter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_starter'
    },
    jerseyNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 99
      },
      field: 'jersey_number'
    },
    captain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  },
  {
    tableName: 'lineups',
    sequelize,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      { fields: ['fixture_id'] },
      { fields: ['player_id'] },
      { fields: ['position'] },
      { fields: ['is_starter'] },
      { fields: ['jersey_number'] },
      { fields: ['captain'] },
      { unique: true, fields: ['fixture_id', 'player_id'] } // Prevent duplicate players in same fixture
    ],
    hooks: {
      beforeCreate: async (lineup: Lineup) => {
        // Ensure only one captain per team per fixture
        if (lineup.captain) {
          const existingCaptain = await Lineup.findOne({
            where: {
              fixtureId: lineup.fixtureId,
              captain: true
            }
          });
          
          if (existingCaptain) {
            throw new Error('Only one captain allowed per team per fixture');
          }
        }

        // Ensure jersey number is unique for the fixture
        if (lineup.jerseyNumber) {
          const existingJersey = await Lineup.findOne({
            where: {
              fixtureId: lineup.fixtureId,
              jerseyNumber: lineup.jerseyNumber
            }
          });
          
          if (existingJersey) {
            throw new Error(`Jersey number ${lineup.jerseyNumber} is already taken for this fixture`);
          }
        }
      }
    }
  }
);

// Setup associations
export function setupLineupAssociations(): void {
  Lineup.belongsTo(Fixture, {
    foreignKey: 'fixtureId',
    as: 'fixture',
    onDelete: 'CASCADE'
  });

  Lineup.belongsTo(Player, {
    foreignKey: 'playerId',
    as: 'player',
    onDelete: 'CASCADE'
  });

  Fixture.hasMany(Lineup, {
    foreignKey: 'fixtureId',
    as: 'lineups',
    onDelete: 'CASCADE'
  });

  Player.hasMany(Lineup, {
    foreignKey: 'playerId',
    as: 'appearances',
    onDelete: 'CASCADE'
  });
}

export default Lineup;