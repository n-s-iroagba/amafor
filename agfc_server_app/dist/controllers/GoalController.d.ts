export declare class GoalController {
    private goalService;
    constructor();
    createGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getGoalsByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteGoal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getGoalsByScorer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPenaltyGoals: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=GoalController.d.ts.map