import { GoalRepository } from '../repositories/GoalRepository';
import { FixtureRepository } from '../repositories/FixtureRepository';
import { NotFoundError, DatabaseError, ValidationError } from '../utils/errors';
import  Goal  from '../models/Goal';
import Fixture from '../models/Fixture';

export class GoalService {
  private goalRepository: GoalRepository;
  private fixtureRepository: FixtureRepository;

  constructor() {
    this.goalRepository = new GoalRepository();
    this.fixtureRepository = new FixtureRepository();
  }

  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    // Validate that the fixture exists
    const fixture = await this.fixtureRepository.findById(goalData.fixtureId as number);
    if (!fixture) {
      throw new ValidationError(`Fixture with ID ${goalData.fixtureId} does not exist`);
    }

    // Validate minute is within reasonable range
    if (goalData.minute && (goalData.minute < 1 || goalData.minute > 120)) {
      throw new ValidationError('Minute must be between 1 and 120');
    }

    try {
      return await this.goalRepository.create(goalData as any);
    } catch (error) {
      throw error
    }
  }

  async getGoalById(id: number): Promise<Goal> {
    const goal = await this.goalRepository.findById(id,{
      include:[
        {
          model:Fixture,
          as: 'fixture'
        }
      ]
    });
    if (!goal) {
      throw new NotFoundError(`Goal with ID ${id} not found`);
    }
    return goal;
  }

  async getGoalsByFixture(fixtureId: number): Promise<Goal[]> {
    try {
      return await this.goalRepository.findByFixture(fixtureId);
    } catch (error) {
      throw error
    }
  }

  async updateGoal(id: number, goalData: Partial<Goal>): Promise<Goal> {
    const goal = await this.getGoalById(id);
    
    try {
      const updatedGoal = await this.goalRepository.updateById(id, goalData);
      if (!updatedGoal) {
        throw new DatabaseError(`Failed to update goal with ID ${id}`);
      }
      return updatedGoal;
    } catch (error) {
      throw error
    }
  }

  async deleteGoal(id: number): Promise<void> {
    await this.getGoalById(id); // Check if goal exists
    
    try {
      const deleted = await this.goalRepository.deleteById(id);
      if (!deleted) {
        throw new DatabaseError(`Failed to delete goal with ID ${id}`);
      }
    } catch (error) {
      throw error
    }
  }

  async getGoalsByScorer(scorer: string): Promise<Goal[]> {
    try {
      return await this.goalRepository.findByScorer(scorer);
    } catch (error) {
      throw error
    }
  }

  async getPenaltyGoals(): Promise<Goal[]> {
    try {
      return await this.goalRepository.findPenalties();
    } catch (error) {
      throw error
    }
  }
}