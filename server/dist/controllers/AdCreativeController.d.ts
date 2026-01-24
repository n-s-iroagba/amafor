import { NextFunction, Request, Response } from 'express';
export declare class AdCreativeController {
    private adCreativeService;
    constructor();
    /**
     * Get all Ad Creatives
     * @api GET /ad-creatives
     * @apiName API-ADV-006
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    getAllAdCreatives(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create Ad Creative
     * @api POST /ad-creatives
     * @apiName API-ADV-007
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    createAdCreative(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get Ad Creative By ID
     * @api GET /ad-creatives/:id
     * @apiName API-ADV-008
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    getAdCreativeById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update Ad Creative
     * @api PUT /ad-creatives/:id
     * @apiName API-ADV-009
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    updateAdCreative(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete Ad Creative
     * @api DELETE /ad-creatives/:id
     * @apiName API-ADV-010
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    deleteAdCreative(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get Creatives by Campaign ID
     * @api GET /campaigns/:id/creatives
     * @apiName API-ADV-011
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    getCreativesByCampaign(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AdCreativeController.d.ts.map