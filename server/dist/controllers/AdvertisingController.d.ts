import { Request, Response, NextFunction } from 'express';
export declare class AdvertisingController {
    private adService;
    constructor();
    /**
     * Create ad campaign
     * @api POST /ads/campaigns
     * @apiName API-AD-001
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-02
     */
    createCampaign: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Serve ad for zone
     * @api GET /ads/serve/:zone
     * @apiName API-AD-002
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-07
     */
    getAdForZone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Track ad click
     * @api GET /ads/track/:id
     * @apiName API-AD-003
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-07
     */
    trackClick: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update ad campaign
     * @api PUT /ads/campaigns/:id
     * @apiName API-AD-004
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-02
     */
    updateCampaign: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete ad campaign
     * @api DELETE /ads/campaigns/:id
     * @apiName API-AD-005
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-02
     */
    deleteCampaign: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get active campaigns
     * @api GET /ads/campaigns/active
     * @apiName API-AD-006
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-02
     */
    getActiveCampaigns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get pending campaigns
     * @api GET /ads/campaigns/pending
     * @apiName API-AD-007
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-02
     */
    getPendingCampaigns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get expired campaigns
     * @api GET /ads/campaigns/expired
     * @apiName API-AD-008
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-02
     */
    getExpiredCampaigns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get advertiser reports
     * @api GET /ads/reports
     * @apiName API-AD-009
     * @apiGroup Advertisements
     * @srsRequirement REQ-ADV-05
     */
    getAdvertiserReports: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdvertisingController.d.ts.map