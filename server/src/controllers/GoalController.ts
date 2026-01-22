import { Request, Response, NextFunction } from 'express';
import { GoalService } from '../services/GoalService';

export class GoalController {
  private goalService: GoalService;

  constructor() {
    this.goalService = new GoalService();
  }

  /**
   * Record goal
   * @api POST /goals
   * @apiName API-GOAL-001
   * @apiGroup Goals
   * @srsRequirement REQ-PUB-02, REQ-ADM-03
   */
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
      const goal = await this.goalService.getGoalById(req.params.id);
      res.status(200).json(goal);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get goals for fixture
   * @api GET /goals/fixture/:fixtureId
   * @apiName API-GOAL-002
   * @apiGroup Goals
   * @srsRequirement REQ-PUB-02
   */
  getGoalsByFixture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goals = await this.goalService.getFixtureGoals(req.params.fixtureId);
      res.status(200).json(goals);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update goal
   * @api PUT /goals/:id
   * @apiName API-GOAL-003
   * @apiGroup Goals
   * @srsRequirement REQ-ADM-03
   */
  updateGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goal = await this.goalService.updateGoal(req.params.id, req.body);
      res.status(200).json(goal);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete goal
   * @api DELETE /goals/:id
   * @apiName API-GOAL-004
   * @apiGroup Goals
   * @srsRequirement REQ-ADM-03
   */
  deleteGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.goalService.deleteGoal(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getGoalsByScorer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goals = await this.goalService.searchGoalsByPlayer(req.params.scorer);
      res.status(200).json(goals);
    } catch (error) {
      next(error);
    }
  };

  getPenaltyGoals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const goals = await this.goalService.getPenaltyStats();
      res.status(200).json(goals);
    } catch (error) {
      next(error);
    }
  };
}