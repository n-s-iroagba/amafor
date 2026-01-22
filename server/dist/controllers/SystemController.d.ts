import { Request, Response, NextFunction } from 'express';
export declare class SystemController {
    private systemService;
    constructor();
    /**
     * Get system configuration
     * @api GET /system/config
     * @apiName API-SYSTEM-001
     * @apiGroup System
     * @srsRequirement REQ-ADM-01
     */
    getConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update system configuration
     * @api PATCH /system/config
     * @apiName API-SYSTEM-002
     * @apiGroup System
     * @srsRequirement REQ-ADM-01
     */
    updateConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get audit logs
     * @api GET /system/audit
     * @apiName API-SYSTEM-003
     * @apiGroup System
     * @srsRequirement REQ-ADM-08
     */
    getAuditLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * List system backups
     * @api GET /system/backups
     * @apiName API-SYSTEM-004
     * @apiGroup System
     * @srsRequirement REQ-ADM-01
     */
    listBackups: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Health check
     * @api GET /health
     * @apiName API-HEALTH-001
     * @apiGroup Health
     * @srsRequirement REQ-ADM-09
     */
    getHealth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Database health check
     * @api GET /health/db
     * @apiName API-HEALTH-002
     * @apiGroup Health
     * @srsRequirement REQ-ADM-09
     */
    getDatabaseHealth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Redis health check
     * @api GET /health/redis
     * @apiName API-HEALTH-003
     * @apiGroup Health
     * @srsRequirement REQ-ADM-09
     */
    getRedisHealth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=SystemController.d.ts.map