import Fixture from "@models/Fixture";
import Goal, { GoalCreationAttributes, GoalAttributes } from "@models/Goal";
import { WhereOptions, Op, fn, col, literal } from "sequelize";
import { BaseRepository } from "./BaseRepository";


export interface IGoalRepository {
  // Standard CRUD (inherited from BaseRepository)
  findById(id: string): Promise<Goal | null>;
  findAll(options?: any): Promise<Goal[]>;
  findOne(options?: any): Promise<Goal | null>;
  create(data: GoalCreationAttributes): Promise<Goal>;
  update(id: string, data: Partial<GoalAttributes>): Promise<[number, Goal[]]>;
  delete(id: string): Promise<number>;
  count(options?: any): Promise<number>;
  paginate(page: number, limit: number, options?: any): Promise<any>;
  exists(id: string): Promise<boolean>;
  
  // Goal-specific methods
  findByFixtureId(fixtureId: string): Promise<Goal[]>;
  findByScorer(scorer: string): Promise<Goal[]>;
  findPenaltyGoals(): Promise<Goal[]>;
  findGoalsInTimeRange(minMinute?: number, maxMinute?: number): Promise<Goal[]>;
  
  // Analytics and statistics
  getFixtureGoalCount(fixtureId: string): Promise<number>;
  getScorerStats(scorer: string): Promise<{
    totalGoals: number;
    penaltyGoals: number;
    averageMinute: number;
    fixturesScoredIn: number;
  }>;
  
  getTopScorers(limit?: number): Promise<Array<{ scorer: string; totalGoals: number }>>;
  getMatchTimeline(fixtureId: string): Promise<Goal[]>;
  
  // Business logic
  getMatchResultByGoals(fixtureId: string): Promise<{ homeGoals: number; awayGoals: number } | null>;
  hasScoredInFixture(fixtureId: string, scorer: string): Promise<boolean>;
  
  // Bulk operations
  bulkCreateForFixture(fixtureId: string, goals: GoalCreationAttributes[]): Promise<Goal[]>;
  deleteByFixtureId(fixtureId: string): Promise<number>;
  
  // Search and filtering
  searchGoalsByScorer(query: string): Promise<Goal[]>;
  getGoalsByMinuteRange(fixtureId?: number): Promise<Record<string, number>>;
}
export class GoalRepository extends BaseRepository<Goal> implements IGoalRepository {
  constructor() {
    super(Goal as any);
  }

  // 🔍 Find goals by fixture ID
  async findByFixtureId(fixtureId: string): Promise<Goal[]> {
    return await this.findAll({
      where: { fixtureId },
      order: [['minute', 'ASC']]
    });
  }

  // 🔍 Find goals by scorer
  async findByScorer(scorer: string): Promise<Goal[]> {
    return await this.findAll({
      where: { scorer },
      order: [['createdAt', 'DESC']]
    });
  }

  // 🔍 Find penalty goals
  async findPenaltyGoals(): Promise<Goal[]> {
    return await this.findAll({
      where: { isPenalty: true },
      order: [['minute', 'ASC']]
    });
  }

  // 🔍 Find goals within a specific time range
  async findGoalsInTimeRange(minMinute?: number, maxMinute?: number): Promise<Goal[]> {
    const where: WhereOptions<GoalAttributes> = {};
    
    if (minMinute !== undefined && maxMinute !== undefined) {
      where.minute = { [Op.between]: [minMinute, maxMinute] };
    } else if (minMinute !== undefined) {
      where.minute = { [Op.gte]: minMinute };
    } else if (maxMinute !== undefined) {
      where.minute = { [Op.lte]: maxMinute };
    }

    return await this.findAll({
      where,
      order: [['minute', 'ASC']]
    });
  }

  // 📊 Get goal count for a fixture
  async getFixtureGoalCount(fixtureId: string): Promise<number> {
    return await this.count({ where: { fixtureId } });
  }

  // 📊 Get scorer statistics
  async getScorerStats(scorer: string): Promise<{
    totalGoals: number;
    penaltyGoals: number;
    averageMinute: number;
    fixturesScoredIn: number;
  }> {
    const [totalGoals, penaltyGoals, averageMinuteResult, fixturesScoredIn] = await Promise.all([
      this.count({ where: { scorer } }),
      this.count({ where: { scorer, isPenalty: true } }),
      this.model.findOne({
        where: { scorer },
        attributes: [[fn('AVG', col('minute')), 'averageMinute']],
        raw: true
      }),
      this.model.count({
        where: { scorer },
        distinct: true,
        col: 'fixtureId'
      })
    ]);

    const averageMinute = averageMinuteResult?.get('averageMinute') as number || 0;

    return {
      totalGoals,
      penaltyGoals,
      averageMinute: Math.round(averageMinute),
      fixturesScoredIn
    };
  }

  // 🏆 Get top scorers
  async getTopScorers(limit: number = 10): Promise<Array<{ scorer: string; totalGoals: number }>> {
    const result = await this.model.findAll({
      attributes: [
        'scorer',
        [fn('COUNT', col('id')), 'totalGoals']
      ],
      group: ['scorer'],
      order: [[literal('totalGoals'), 'DESC']],
      limit,
      raw: true
    });

    return result.map(row => ({
      scorer: row.scorer,
      totalGoals: parseInt(row.get('totalGoals') as string)
    }));
  }

  // 📅 Get match timeline (goals in chronological order)
  async getMatchTimeline(fixtureId: string): Promise<Goal[]> {
    return await this.findAll({
      where: { fixtureId },
      order: [['minute', 'ASC']],
      include: [{
        model: Fixture,
        as: 'fixture',
        attributes: ['id', 'homeTeam', 'awayTeam', 'competition']
      }]
    });
  }

  // ⚽ Get match result based on goals
  async getMatchResultByGoals(fixtureId: string): Promise<{ homeGoals: number; awayGoals: number } | null> {
    const fixture = await Fixture.findByPk(fixtureId);
    if (!fixture) {
      return null;
    }

    const goals = await this.findByFixtureId(fixtureId);
    
    // This assumes we have a way to determine if a goal is for home or away
    // You might need to adjust this based on your actual data structure
    let homeGoals = 0;
    let awayGoals = 0;

    goals.forEach(goal => {
      // Simple logic: you might need to store team information in Goal model
      // or have a more sophisticated way to determine which team scored
      // For now, we'll use a placeholder logic
      if (goal.scorer.includes(fixture.homeTeam)) {
        homeGoals++;
      } else if (goal.scorer.includes(fixture.awayTeam)) {
        awayGoals++;
      }
    });

    return { homeGoals, awayGoals };
  }

  // ✅ Check if a player has scored in a fixture
  async hasScoredInFixture(fixtureId: string, scorer: string): Promise<boolean> {
    const count = await this.count({
      where: { fixtureId, scorer }
    });
    return count > 0;
  }

  // 🔄 Bulk create goals for a fixture
  async bulkCreateForFixture(fixtureId: string, goals: GoalCreationAttributes[]): Promise<Goal[]> {
    // Validate fixture exists
    const fixture = await Fixture.findByPk(fixtureId);
    if (!fixture) {
      throw new Error(`Fixture with ID ${fixtureId} not found`);
    }

    // Add fixtureId to each goal
    const goalsWithFixture = goals.map(goal => ({
      ...goal,
      fixtureId
    }));

    return await this.bulkCreate(goalsWithFixture);
  }

  // 🗑️ Delete all goals for a fixture
  async deleteByFixtureId(fixtureId: string): Promise<number> {
    return await this.model.destroy({
      where: { fixtureId }
    });
  }

  // 🔍 Search goals by scorer name
  async searchGoalsByScorer(query: string): Promise<Goal[]> {
    return await this.findAll({
      where: {
        scorer: { [Op.iLike]: `%${query}%` }
      },
      order: [['minute', 'ASC']],
      include: [{
        model: Fixture,
        as: 'fixture',
        attributes: ['id', 'homeTeam', 'awayTeam', 'matchDate']
      }]
    });
  }

  // 📊 Get goals distribution by minute range
  async getGoalsByMinuteRange(fixtureId?: number): Promise<Record<string, number>> {
    const where: WhereOptions<GoalAttributes> = {};
    if (fixtureId) {
      where.fixtureId = fixtureId;
    }

    const goals = await this.findAll({
      where,
      attributes: ['minute']
    });

    // Categorize goals by minute ranges
    const minuteRanges = [
      { label: '0-15', min: 0, max: 15 },
      { label: '16-30', min: 16, max: 30 },
      { label: '31-45', min: 31, max: 45 },
      { label: '45+', min: 45, max: 50 }, // Stoppage time in first half
      { label: '46-60', min: 46, max: 60 },
      { label: '61-75', min: 61, max: 75 },
      { label: '76-90', min: 76, max: 90 },
      { label: '90+', min: 90, max: 120 } // Stoppage time in second half
    ];

    const result: Record<string, number> = {};
    minuteRanges.forEach(range => {
      result[range.label] = 0;
    });

    goals.forEach(goal => {
      const minute = goal.minute;
      const range = minuteRanges.find(r => minute >= r.min && minute <= r.max);
      if (range) {
        result[range.label]++;
      }
    });

    return result;
  }

  // 🎯 Override create to validate fixture exists
  async create(data: GoalCreationAttributes): Promise<Goal> {
    // Validate fixture exists
    const fixture = await Fixture.findByPk(data.fixtureId);
    if (!fixture) {
      throw new Error(`Fixture with ID ${data.fixtureId} not found`);
    }

    // Validate minute is within reasonable bounds
    if (data.minute < 0 || data.minute > 120) {
      throw new Error('Minute must be between 0 and 120');
    }

    return await super.create(data);
  }

  // 🎯 Override update to validate minute
  async update(id: string, data: Partial<GoalAttributes>): Promise<[number, Goal[]]> {
    // Validate minute if being updated
    if (data.minute !== undefined && (data.minute < 0 || data.minute > 120)) {
      throw new Error('Minute must be between 0 and 120');
    }

    return await super.update(id, data);
  }

  // 🔧 Get late goals (goals after 80th minute)
  async getLateGoals(fixtureId?: number): Promise<Goal[]> {
    const where: WhereOptions<GoalAttributes> = {
      minute: { [Op.gte]: 80 }
    };
    
    if (fixtureId) {
      where.fixtureId = fixtureId;
    }

    return await this.findAll({
      where,
      order: [['minute', 'ASC']]
    });
  }

  // 🔧 Get early goals (goals before 20th minute)
  async getEarlyGoals(fixtureId?: number): Promise<Goal[]> {
    const where: WhereOptions<GoalAttributes> = {
      minute: { [Op.lte]: 20 }
    };
    
    if (fixtureId) {
      where.fixtureId = fixtureId;
    }

    return await this.findAll({
      where,
      order: [['minute', 'ASC']]
    });
  }

  // 📈 Get goal statistics for a competition/season
  async getCompetitionStats(competition?: string): Promise<{
    totalGoals: number;
    averageGoalsPerMatch: number;
    totalPenalties: number;
    mostGoalsInAMatch: number;
  }> {
    // This would require joining with Fixture table
    // For simplicity, we'll return basic stats
    
    const [totalGoals, totalPenalties] = await Promise.all([
      this.count(),
      this.count({ where: { isPenalty: true } })
    ]);

    const totalFixtures = await Fixture.count();
    const averageGoalsPerMatch = totalFixtures > 0 ? totalGoals / totalFixtures : 0;

    // Find match with most goals (would need a more complex query)
    // For now, we'll use a placeholder
    const mostGoalsInAMatch = 10; // This would need to be calculated

    return {
      totalGoals,
      averageGoalsPerMatch: parseFloat(averageGoalsPerMatch.toFixed(2)),
      totalPenalties,
      mostGoalsInAMatch
    };
  }
}