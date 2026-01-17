"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalService = void 0;
// services/GoalService.ts
const GoalRepository_1 = require("@repositories/GoalRepository");
const Fixture_1 = require("@models/Fixture");
const logger_1 = __importDefault(require("@utils/logger"));
class GoalService {
    constructor(repository) {
        this.repository = repository || new GoalRepository_1.GoalRepository();
    }
    async createGoal(data) {
        try {
            // Validate fixture exists
            const fixture = await Fixture_1.Fixture.findByPk(data.fixtureId);
            if (!fixture) {
                throw new AppError('Fixture not found', 404);
            }
            // Check if minute is within match duration
            if (data.minute < 0 || data.minute > 120) {
                throw new AppError('Minute must be between 0 and 120', 400);
            }
            // Check if scorer already scored in this fixture (optional)
            const existingGoal = await this.repository.hasScoredInFixture(data.fixtureId, data.scorer);
            if (existingGoal && data.isPenalty) {
                logger_1.default.warn(`Player ${data.scorer} has already scored in fixture ${data.fixtureId}`);
            }
            const goal = await this.repository.create(data);
            logger_1.default.info('Goal created', {
                goalId: goal.id,
                fixtureId: data.fixtureId,
                scorer: data.scorer,
                minute: data.minute
            });
            return goal.toJSON();
        }
        catch (error) {
            logger_1.default.error('Failed to create goal', {
                error: error.message,
                data
            });
            throw error;
        }
    }
    async getGoalById(id) {
        const goal = await this.repository.findById(id);
        if (!goal) {
            throw new AppError('Goal not found', 404);
        }
        return goal.toJSON();
        ;
    }
    async getFixtureGoals(fixtureId) {
        const goals = await this.repository.findByFixtureId(fixtureId);
        return goals.map(g => g.toJSON());
    }
    async updateGoal(id, data) {
        try {
            const goal = await this.repository.findById(id);
            if (!goal) {
                throw new AppError('Goal not found', 404);
            }
            // Prevent updating certain fields
            const restrictedFields = ['fixtureId', 'createdAt', 'updatedAt'];
            Object.keys(data).forEach(key => {
                if (restrictedFields.includes(key)) {
                    delete data[key];
                }
            });
            await this.repository.update(id, data);
            // Get updated goal
            const updatedGoal = await this.repository.findById(id);
            if (!updatedGoal) {
                throw new AppError('Failed to retrieve updated goal', 500);
            }
            logger_1.default.info('Goal updated', { goalId: id, updates: data });
            return updatedGoal.toJSON();
        }
        catch (error) {
            logger_1.default.error('Failed to update goal', {
                error: error.message,
                goalId: id,
                data
            });
            throw error;
        }
    }
    async deleteGoal(id) {
        const result = await this.repository.delete(id);
        if (result === 0) {
            throw new AppError('Goal not found', 404);
        }
        logger_1.default.info('Goal deleted', { goalId: id });
    }
    async getMatchTimeline(fixtureId) {
        try {
            const goals = await this.repository.getMatchTimeline(fixtureId);
            return goals.map(goal => ({
                id: goal.id,
                scorer: goal.scorer,
                minute: goal.minute,
                isPenalty: goal.isPenalty,
                fixtureDetails: goal.fixture ? {
                    id: goal.fixture.id,
                    homeTeam: goal.fixture.homeTeam,
                    awayTeam: goal.fixture.awayTeam,
                    matchDate: goal.fixture.matchDate
                } : {
                    id: goal.fixtureId,
                    homeTeam: 'Unknown',
                    awayTeam: 'Unknown',
                    matchDate: new Date()
                }
            }));
        }
        catch (error) {
            logger_1.default.error('Failed to get match timeline', {
                fixtureId,
                error: error.message
            });
            throw error;
        }
    }
    async getScorerLeaderboard(limit = 10) {
        try {
            const topScorers = await this.repository.getTopScorers(limit);
            const leaderboard = await Promise.all(topScorers.map(async (scorerData) => {
                const stats = await this.repository.getScorerStats(scorerData.scorer);
                // Get last goal date
                const lastGoal = await this.repository.findOne({
                    where: { scorer: scorerData.scorer },
                    order: [['createdAt', 'DESC']]
                });
                return {
                    scorer: scorerData.scorer,
                    totalGoals: scorerData.totalGoals,
                    penaltyGoals: stats.penaltyGoals,
                    averageMinute: stats.averageMinute,
                    lastGoalDate: lastGoal ? lastGoal.createdAt : null
                };
            }));
            return leaderboard;
        }
        catch (error) {
            logger_1.default.error('Failed to get scorer leaderboard', { error: error.message });
            throw error;
        }
    }
    async getGoalDistribution(fixtureId) {
        return await this.repository.getGoalsByMinuteRange(fixtureId);
    }
    async getLateGoals(fixtureId) {
        const goals = await this.repository.getLateGoals(fixtureId);
        return goals.map(g => g.toJSON());
    }
    async getEarlyGoals(fixtureId) {
        const goals = await this.repository.getEarlyGoals(fixtureId);
        return goals.map(g => g.toJSON());
    }
    async getPenaltyStats() {
        const penaltyGoals = await this.repository.findPenaltyGoals();
        const totalGoals = await this.repository.count();
        const penaltyScorers = new Map();
        penaltyGoals.forEach(goal => {
            penaltyScorers.set(goal.scorer, (penaltyScorers.get(goal.scorer) || 0) + 1);
        });
        const topPenaltyScorers = Array.from(penaltyScorers.entries())
            .map(([scorer, penalties]) => ({ scorer, penalties }))
            .sort((a, b) => b.penalties - a.penalties)
            .slice(0, 5);
        return {
            totalPenalties: penaltyGoals.length,
            penaltyConversionRate: totalGoals > 0 ? (penaltyGoals.length / totalGoals) * 100 : 0,
            topPenaltyScorers
        };
    }
    async searchGoalsByPlayer(query) {
        const goals = await this.repository.searchGoalsByScorer(query);
        return goals.map(g => g.toJSON());
    }
    // 🎯 Calculate hat-trick achievements
    async getHatTrickAchievements() {
        // This would require a more complex query to find fixtures where a player scored 3+ goals
        // For now, return empty array
        return [];
    }
    // 🎯 Get fastest goal in competition
    async getFastestGoal(competition) {
        const where = {};
        if (competition) {
            // Need to join with Fixture table to filter by competition
            // This is simplified
        }
        const goal = await this.repository.findOne({
            where,
            order: [['minute', 'ASC']]
        });
        return goal ? goal.toJSON() : null;
    }
    // 🔧 Bulk create match goals (for importing match data)
    async bulkCreateMatchGoals(fixtureId, goalsData) {
        try {
            const fixture = await Fixture_1.Fixture.findByPk(fixtureId);
            if (!fixture) {
                throw new AppError('Fixture not found', 404);
            }
            const goals = await this.repository.bulkCreateForFixture(fixtureId, goalsData);
            logger_1.default.info('Bulk created goals', {
                fixtureId,
                goalCount: goals.length
            });
            return goals.map(g => g.toJSON());
        }
        catch (error) {
            logger_1.default.error('Failed to bulk create goals', {
                fixtureId,
                error: error.message
            });
            throw error;
        }
    }
}
exports.GoalService = GoalService;
// Helper class for application errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
//# sourceMappingURL=GoalService.js.map