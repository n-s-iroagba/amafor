import { Request, Response, NextFunction } from 'express';
export declare class DisputeController {
    private disputeService;
    constructor();
    createDispute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyDisputes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDispute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=DisputeController.d.ts.map