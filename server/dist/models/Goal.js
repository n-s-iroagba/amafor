"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
// models/Goal.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// Main Goal model
class Goal extends sequelize_1.Model {
    // Instance methods
    isEarlyGoal() {
        return this.minute <= 20;
    }
    isLateGoal() {
        return this.minute >= 80;
    }
    isStoppageTimeGoal() {
        return (this.minute >= 45 && this.minute <= 50) || (this.minute >= 90 && this.minute <= 120);
    }
    // Static methods
    static async getFixtureGoals(fixtureId) {
        return await this.findAll({
            where: { fixtureId },
            order: [['minute', 'ASC']]
        });
    }
    static async getTopScorer(limit = 1) {
        const result = await this.sequelize.query(`
      SELECT scorer, COUNT(*) as count
      FROM goals
      GROUP BY scorer
      ORDER BY count DESC
      LIMIT ${limit}
    `, { type: 'SELECT' });
        return result;
    }
}
exports.Goal = Goal;
// Model initialization
Goal.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fixtureId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'fixtures',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    scorer: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100]
        }
    },
    minute: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 120
        }
    },
    isPenalty: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_penalty'
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'goals',
    sequelize: database_1.default,
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
        beforeCreate: (goal) => {
            if (goal.minute < 0 || goal.minute > 120) {
                throw new Error('Minute must be between 0 and 120');
            }
        },
        beforeUpdate: (goal) => {
            if (goal.changed('minute') && (goal.minute < 0 || goal.minute > 120)) {
                throw new Error('Minute must be between 0 and 120');
            }
        }
    }
});
exports.default = Goal;
//# sourceMappingURL=Goal.js.map