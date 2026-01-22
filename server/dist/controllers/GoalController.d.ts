import { Request, Response, NextFunction } from 'express';
export declare class GoalController {
    private goalService;
    constructor();
    /**
     * Record goal
     * @api POST /goals
     * @apiName API-GOAL-001
     * @apiGroup Goals
     * @srsRequirement REQ-PUB-02, REQ-ADM-03
     */
    createGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get goals for fixture
     * @api GET /goals/fixture/:fixtureId
     * @apiName API-GOAL-002
     * @apiGroup Goals
     * @srsRequirement REQ-PUB-02
     */
    getGoalsByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update goal
     * @api PUT /goals/:id
     * @apiName API-GOAL-003
     * @apiGroup Goals
     * @srsRequirement REQ-ADM-03
     */
    updateGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete goal
     * @api DELETE /goals/:id
     * @apiName API-GOAL-004
     * @apiGroup Goals
     * @srsRequirement REQ-ADM-03
     */
    deleteGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getGoalsByScorer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPenaltyGoals: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=GoalController.d.ts.map