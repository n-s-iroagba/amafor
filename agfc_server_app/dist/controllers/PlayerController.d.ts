export declare class PlayerController {
    private playerService;
    constructor();
    createPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPlayerProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listPlayers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generateScoutReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=PlayerController.d.ts.map