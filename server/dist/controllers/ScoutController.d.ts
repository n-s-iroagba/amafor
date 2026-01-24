import { Request, Response, NextFunction } from 'express';
export declare class ScoutController {
    private scoutService;
    constructor();
    listReports: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    submitApplication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ScoutController.d.ts.map