import { Request, Response, NextFunction } from 'express';
export declare class AdZoneController {
    private adZoneService;
    constructor();
    /**
     * Get all Zones
     * @api GET /ads/zones
     */
    getAllZones: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Active Zones
     * @api GET /ads/zones/active
     */
    getActiveZones: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdZoneController.d.ts.map