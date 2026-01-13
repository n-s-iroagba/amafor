import { Request, Response, NextFunction } from 'express';
import { GoalService } from '../services/GoalService';

export class GoalController {
  private goalService: GoalService;

  constructor() {
    this.goalService = new GoalService();
  }

  createGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goal = await this.goalService.createGoal(req.body);
      res.status(201).json(goal);
    } catch (error) {
      next(error);
    }
  };

  getGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goal = await this.goalService.getGoalById(parseInt(req.params.id));
      res.status(200).json(goal);
    } catch (error) {
      next(error);
    }
  };

  getGoalsByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goals = await this.goalService.getGoalsByFixture(parseInt(req.params.fixtureId));
      res.status(200).json(goals);
    } catch (error) {
      next(error);
    }
  };

  updateGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goal = await this.goalService.updateGoal(parseInt(req.params.id), req.body);
      res.status(200).json(goal);
    } catch (error) {
      next(error);
    }
  };

  deleteGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.goalService.deleteGoal(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getGoalsByScorer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goals = await this.goalService.getGoalsByScorer(req.params.scorer);
      res.status(200).json(goals);
    } catch (error) {
      next(error);
    }
  };

  getPenaltyGoals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goals = await this.goalService.getPenaltyGoals();
      res.status(200).json(goals);
    } catch (error) {
      next(error);
    }
  };
}