import { Request, Response, NextFunction } from 'express';
export declare class FixtureSummaryController {
    private matchSummaryService;
    constructor();
    /**
     * Create match summary
     * @api POST /match-summary
     * @apiName API-SUMMARY-001
     * @apiGroup Fixture Summary
     * @srsRequirement REQ-ADM-03
     */
    createFixtureSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFixtureSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get summary for fixture
     * @api GET /match-summary/fixture/:fixtureId
     * @apiName API-SUMMARY-002
     * @apiGroup Fixture Summary
     * @srsRequirement REQ-PUB-01
     */
    getFixtureSummaryByFixture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update summary
     * @api PUT /match-summary/:id
     * @apiName API-SUMMARY-003
     * @apiGroup Fixture Summary
     * @srsRequirement REQ-ADM-03
     */
    updateFixtureSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete summary
     * @api DELETE /match-summary/:id
     * @apiName API-SUMMARY-004
     * @apiGroup Fixture Summary
     * @srsRequirement REQ-ADM-03
     */
    deleteFixtureSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=FixtureSummaryController.d.ts.map