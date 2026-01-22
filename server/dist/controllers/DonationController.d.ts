import { Request, Response, NextFunction } from 'express';
export declare class DonationController {
    private donationService;
    constructor();
    /**
     * Initiate donation
     * @api POST /donations/initiate
     * @apiName API-DONATION-001
     * @apiGroup Donations
     * @srsRequirement REQ-DON-01
     */
    initiateDonation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Handle payment webhook
     * @api POST /donations/webhook
     * @apiName API-DONATION-002
     * @apiGroup Donations
     * @srsRequirement REQ-DON-01
     */
    handleWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get public donor wall
     * @api GET /donations/wall
     * @apiName API-DONATION-003
     * @apiGroup Donations
     * @srsRequirement REQ-DON-01
     */
    getDonorWall: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * List donations (admin)
     * @api GET /donations
     * @apiName API-DONATION-004
     * @apiGroup Donations
     * @srsRequirement REQ-DON-01
     */
    listDonations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=DonationController.d.ts.map