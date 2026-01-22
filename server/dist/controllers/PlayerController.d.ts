import { Request, Response, NextFunction } from 'express';
export declare class PlayerController {
    private playerService;
    constructor();
    /**
     * Create a new player
     * @api POST /players
     * @apiName API-PLAYER-003
     * @apiGroup Players
     * @srsRequirement REQ-ADM-04
     */
    createPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get player profile by ID
     * @api GET /players/:id
     * @apiName API-PLAYER-002
     * @apiGroup Players
     * @srsRequirement REQ-PUB-05, REQ-SCT-02
     */
    getPlayerProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * List all players (public)
     * @api GET /players
     * @apiName API-PLAYER-001
     * @apiGroup Players
     * @srsRequirement REQ-PUB-05, REQ-SCT-02
     */
    listPlayers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update player statistics
     * @api PATCH /players/:id/stats
     * @apiName API-PLAYER-004
     * @apiGroup Players
     * @srsRequirement REQ-ADM-04
     */
    updateStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Generate scout report for a player
     * @api GET /players/:id/report
     * @apiName API-PLAYER-005
     * @apiGroup Players
     * @srsRequirement REQ-SCT-04
     */
    generateScoutReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=PlayerController.d.ts.map