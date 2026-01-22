import { Request, Response, NextFunction } from 'express';
export declare class AuditController {
    private auditService;
    constructor();
    /**
     * Get entity audit history
     * @api GET /audit/:entityType/:entityId
     * @apiName API-AUDIT-001
     * @apiGroup Audit
     * @srsRequirement REQ-AUDIT-01
     */
    getEntityHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuditController.d.ts.map