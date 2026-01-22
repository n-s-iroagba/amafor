import { Request, Response } from 'express';
export declare class AdZoneController {
    private adZoneService;
    constructor();
    /**
     * List all ad zones
     * @api GET /ad-zones
     * @apiName API-ADZONE-001
     * @apiGroup Ad Zones
     * @srsRequirement REQ-ADV-06
     */
    getAllZones(req: Request, res: Response): Promise<void>;
    /**
     * List active ad zones
     * @api GET /ad-zones/active
     * @apiName API-ADZONE-002
     * @apiGroup Ad Zones
     * @srsRequirement REQ-ADV-06
     */
    getActiveZones(req: Request, res: Response): Promise<void>;
    /**
     * Get zone details
     * @api GET /ad-zones/:zone
     * @apiName API-ADZONE-003
     * @apiGroup Ad Zones
     * @srsRequirement REQ-ADV-06
     */
    getZoneByType(req: Request, res: Response): Promise<void>;
    /**
     * Update zone pricing
     * @api PATCH /ad-zones/:zone/price
     * @apiName API-ADZONE-004
     * @apiGroup Ad Zones
     * @srsRequirement REQ-ADV-06
     */
    updateZonePrice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Calculate campaign cost
     * @api POST /ad-zones/:zone/calculate
     * @apiName API-ADZONE-005
     * @apiGroup Ad Zones
     * @srsRequirement REQ-ADV-06
     */
    calculateCampaignCost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get zone statistics
     * @api GET /ad-zones/stats
     * @apiName API-ADZONE-006
     * @apiGroup Ad Zones
     * @srsRequirement REQ-ADV-06
     */
    getZoneStats(req: Request, res: Response): Promise<void>;
    /**
     * Get zone recommendation
     * @api POST /ad-zones/recommend
     * @apiName API-ADZONE-007
     * @apiGroup Ad Zones
     * @srsRequirement REQ-ADV-06
     */
    findBestZoneForBudget(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=AdZoneController.d.ts.map