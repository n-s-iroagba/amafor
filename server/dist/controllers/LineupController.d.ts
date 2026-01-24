import { Request, Response, NextFunction } from 'express';
export declare class LineupController {
    private lineupService;
    constructor();
    /**
     * Create match lineup
     * @api POST /lineups
     * @apiName API-LINEUP-001
     * @apiGroup Lineups
     * @srsRequirement REQ-PUB-02, REQ-ADM-03
     */
    createLineup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLineupPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get lineup for fixture
     * @api GET /lineups/fixture/:fixtureId
     * @apiName API-LINEUP-002
     * @apiGroup Lineups
     * @srsRequirement REQ-PUB-02
     */
    getLineupByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStartersByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSubstitutesByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update lineup
     * @api PUT /lineups/:id
     * @apiName API-LINEUP-003
     * @apiGroup Lineups
     * @srsRequirement REQ-ADM-03
     */
    updateLineupPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete lineup
     * @api DELETE /lineups/:id
     * @apiName API-LINEUP-004
     * @apiGroup Lineups
     * @srsRequirement REQ-ADM-03
     */
    deleteLineupPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    batchUpdateLineup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=LineupController.d.ts.map