// services/GoalService.ts
import { GoalRepository, IGoalRepository } from '@repositories/GoalRepository';
import { Goal, GoalAttributes, GoalCreationAttributes } from '@models/Goal';
import { Fixture } from '@models/Fixture';
import logger from '@utils/logger';
import { AppError } from '@utils/errors';

export interface CreateGoalData extends Omit<GoalCreationAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export interface UpdateGoalData extends Partial<Omit<GoalAttributes, 'id' | 'createdAt' | 'updatedAt'>> { }

export interface GoalAnalytics {
  id: string;
  scorer: string;
  minute: number;
  isPenalty: boolean;
  fixtureDetails: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    matchDate: Date;
  };
}

export interface ScorerLeaderboard {
  scorer: string;
  totalGoals: number;
  penaltyGoals: number;
  averageMinute: number;
  lastGoalDate: Date | null;
}

export class GoalService {
  private repository: IGoalRepository;

  constructor(repository?: IGoalRepository) {
    this.repository = repository || new GoalRepository();
  }

  async createGoal(data: GoalCreationAttributes): Promise<GoalAttributes> {
    try {
      // Validate fixture exists
      const fixture = await Fixture.findByPk(data.fixtureId);
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
        logger.warn(`Player ${data.scorer} has already scored in fixture ${data.fixtureId}`);
      }

      const goal = await this.repository.create(data);

      logger.info('Goal created', {
        goalId: goal.id,
        fixtureId: data.fixtureId,
        scorer: data.scorer,
        minute: data.minute
      });

      return goal.toJSON() as unknown as GoalAttributes;

    } catch (error: any) {
      logger.error('Failed to create goal', {
        error: error.message,
        data
      });
      throw error;
    }
  }

  async getGoalById(id: string): Promise<GoalAttributes> {
    const goal = await this.repository.findById(id);
    if (!goal) {
      throw new AppError('Goal not found', 404);
    }
    return goal.toJSON() as unknown as GoalAttributes;;
  }

  async getFixtureGoals(fixtureId: string): Promise<GoalAttributes[]> {
    const goals = await this.repository.findByFixtureId(fixtureId);
    return goals.map(g => g.toJSON() as unknown as GoalAttributes);
  }

  async updateGoal(id: string, data: UpdateGoalData): Promise<GoalAttributes> {
    try {
      const goal = await this.repository.findById(id);
      if (!goal) {
        throw new AppError('Goal not found', 404);
      }

      // Prevent updating certain fields
      const restrictedFields = ['fixtureId', 'createdAt', 'updatedAt'];
      Object.keys(data).forEach(key => {
        if (restrictedFields.includes(key)) {
          delete (data as any)[key];
        }
      });

      await this.repository.update(id, data);

      // Get updated goal
      const updatedGoal = await this.repository.findById(id);
      if (!updatedGoal) {
        throw new AppError('Failed to retrieve updated goal', 500);
      }

      logger.info('Goal updated', { goalId: id, updates: data });

      return updatedGoal.toJSON() as GoalAttributes;

    } catch (error: any) {
      logger.error('Failed to update goal', {
        error: error.message,
        goalId: id,
        data
      });
      throw error;
    }
  }

  async deleteGoal(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result === 0) {
      throw new AppError('Goal not found', 404);
    }

    logger.info('Goal deleted', { goalId: id });
  }

  async getFixtureTimeline(fixtureId: string): Promise<GoalAnalytics[]> {
    try {
      const goals = await this.repository.getFixtureTimeline(fixtureId);

      return goals.map((goal: Goal) => {
        const goalData = goal as any;
        return {
          id: String(goal.id),
          scorer: goal.scorer,
          minute: goal.minute,
          isPenalty: goal.isPenalty,
          fixtureDetails: goalData.fixture ? {
            id: goalData.fixture.id,
            homeTeam: goalData.fixture.homeTeam,
            awayTeam: goalData.fixture.awayTeam,
            matchDate: goalData.fixture.matchDate
          } : {
            id: goal.fixtureId,
            homeTeam: 'Unknown',
            awayTeam: 'Unknown',
            matchDate: new Date()
          }
        };
      });
    } catch (error: any) {
      logger.error('Failed to get match timeline', {
        fixtureId,
        error: error.message
      });
      throw error;
    }
  }

  async getScorerLeaderboard(limit: number = 10): Promise<ScorerLeaderboard[]> {
    try {
      const topScorers = await this.repository.getTopScorers(limit);

      const leaderboard = await Promise.all(
        topScorers.map(async (scorerData) => {
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
        })
      );

      return leaderboard;
    } catch (error: any) {
      logger.error('Failed to get scorer leaderboard', { error: error.message });
      throw error;
    }
  }

  async getGoalDistribution(fixtureId?: number): Promise<Record<string, number>> {
    return await this.repository.getGoalsByMinuteRange(fixtureId);
  }

  async getLateGoals(fixtureId?: number): Promise<GoalAttributes[]> {
    const goals = await this.repository.getLateGoals(fixtureId);
    return goals.map((g: Goal) => g.toJSON() as unknown as GoalAttributes);
  }

  async getEarlyGoals(fixtureId?: number): Promise<GoalAttributes[]> {
    const goals = await this.repository.getEarlyGoals(fixtureId);
    return goals.map((g: Goal) => g.toJSON() as unknown as GoalAttributes);
  }

  async getPenaltyStats(): Promise<{
    totalPenalties: number;
    penaltyConversionRate: number; // This would need shot data
    topPenaltyScorers: Array<{ scorer: string; penalties: number }>;
  }> {
    const penaltyGoals = await this.repository.findPenaltyGoals();
    const totalGoals = await this.repository.count();

    const penaltyScorers = new Map<string, number>();
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

  async searchGoalsByPlayer(query: string): Promise<GoalAttributes[]> {
    const goals = await this.repository.searchGoalsByScorer(query);
    return goals.map(g => g.toJSON() as unknown as GoalAttributes);
  }

  // 🎯 Calculate hat-trick achievements
  async getHatTrickAchievements(): Promise<Array<{ scorer: string; fixtureId: string; goals: number }>> {
    // This would require a more complex query to find fixtures where a player scored 3+ goals
    // For now, return empty array
    return [];
  }

  // 🎯 Get fastest goal in competition
  async getFastestGoal(competition?: string): Promise<GoalAttributes | null> {
    const where: any = {};
    if (competition) {
      // Need to join with Fixture table to filter by competition
      // This is simplified
    }

    const goal = await this.repository.findOne({
      where,
      order: [['minute', 'ASC']]
    });

    return goal ? goal.toJSON() as unknown as GoalAttributes : null;
  }

  // 🔧 Bulk create match goals (for importing match data)
  async bulkCreateFixtureGoals(fixtureId: string, goalsData: CreateGoalData[]): Promise<GoalAttributes[]> {
    try {
      const fixture = await Fixture.findByPk(fixtureId);
      if (!fixture) {
        throw new AppError('Fixture not found', 404);
      }

      const goals = await this.repository.bulkCreateForFixture(fixtureId, goalsData);

      logger.info('Bulk created goals', {
        fixtureId,
        goalCount: goals.length
      });

      return goals.map(g => g.toJSON() as unknown as GoalAttributes);
    } catch (error: any) {
      logger.error('Failed to bulk create goals', {
        fixtureId,
        error: error.message
      });
      throw error;
    }
  }
}