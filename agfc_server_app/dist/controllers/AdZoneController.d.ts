import { Request, Response } from 'express';
export declare class AdZoneController {
    private adZoneService;
    constructor();
    getAllZones(req: Request, res: Response): Promise<void>;
    getActiveZones(req: Request, res: Response): Promise<void>;
    getZoneByType(req: Request, res: Response): Promise<void>;
    updateZonePrice(req: Request, res: Response): Promise<any>;
    calculateCampaignCost(req: Request, res: Response): Promise<any>;
    getZoneStats(req: Request, res: Response): Promise<void>;
    findBestZoneForBudget(req: Request, res: Response): Promise<any>;
}
//# sourceMappingURL=AdZoneController.d.ts.map