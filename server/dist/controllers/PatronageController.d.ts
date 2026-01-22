import { Request, Response, NextFunction } from 'express';
export declare class PatronageController {
    private patronageService;
    constructor();
    /**
     * Create patron subscription
     * @api POST /patrons/subscribe
     * @apiName API-PATRON-001
     * @apiGroup Patronage
     * @srsRequirement REQ-SUP-02
     */
    subscribe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * List all patrons
     * @api GET /patrons
     * @apiName API-PATRON-002
     * @apiGroup Patronage
     * @srsRequirement REQ-SUP-03, REQ-ADM-10
     */
    listPatrons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get patron details
     * @api GET /patrons/:id
     * @apiName API-PATRON-003
     * @apiGroup Patronage
     * @srsRequirement REQ-ADM-10
     */
    getPatronDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update patron status
     * @api PATCH /patrons/:id/status
     * @apiName API-PATRON-004
     * @apiGroup Patronage
     * @srsRequirement REQ-ADM-10
     */
    updatePatronStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cancel subscription
     * @api DELETE /patrons/:id
     * @apiName API-PATRON-005
     * @apiGroup Patronage
     * @srsRequirement REQ-ADM-10
     */
    cancelSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Check subscription status
     * @remarks This is a utility method not in API spec
     */
    checkStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=PatronageController.d.ts.map