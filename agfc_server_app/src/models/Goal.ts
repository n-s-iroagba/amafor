// models/Goal.ts
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


// Interface for attributes
export interface GoalAttributes {
  id: number;
  fixtureId: number;
  scorer: string;
  minute: number;
  isPenalty: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creation attributes
export type GoalCreationAttributes = Omit<GoalAttributes, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

// Main Goal model
export class Goal extends Model<
  InferAttributes<Goal>,
  InferCreationAttributes<Goal>
> {
  declare id: CreationOptional<number>;
  declare fixtureId: string;
  declare scorer: string;
  declare minute: number;
  declare isPenalty: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;



  // Instance methods
  isEarlyGoal(): boolean {
    return this.minute <= 20;
  }

  isLateGoal(): boolean {
    return this.minute >= 80;
  }

  isStoppageTimeGoal(): boolean {
    return (this.minute >= 45 && this.minute <= 50) || (this.minute >= 90 && this.minute <= 120);
  }

  // Static methods
  static async getFixtureGoals(fixtureId: number): Promise<Goal[]> {
    return await this.findAll({ 
      where: { fixtureId },
      order: [['minute', 'ASC']]
    });
  }

  static async getTopScorer(limit: number = 1): Promise<Array<{ scorer: string; count: number }>> {
    const result = await this.sequelize!.query(`
      SELECT scorer, COUNT(*) as count
      FROM goals
      GROUP BY scorer
      ORDER BY count DESC
      LIMIT ${limit}
    `, { type: 'SELECT' });

    return result as Array<{ scorer: string; count: number }>;
  }
}

// Model initialization
Goal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fixtureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fixtures',
        key: 'id',
      },
    
      onDelete: 'CASCADE'
    },
    scorer: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 120
      }
    },
    isPenalty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_penalty'
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
    tableName: 'goals',
    sequelize,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      { fields: ['fixtureId'] },
      { fields: ['scorer'] },
      { fields: ['minute'] },
      { fields: ['is_penalty'] },
      { fields: ['created_at'] }
    ],
    hooks: {
      beforeCreate: (goal: Goal) => {
        if (goal.minute < 0 || goal.minute > 120) {
          throw new Error('Minute must be between 0 and 120');
        }
      },
      beforeUpdate: (goal: Goal) => {
        if (goal.changed('minute') && (goal.minute < 0 || goal.minute > 120)) {
          throw new Error('Minute must be between 0 and 120');
        }
      }
    }
  }
);



export default Goal;