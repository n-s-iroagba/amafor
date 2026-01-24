"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisingController = void 0;
const services_1 = require("../services");
class AdvertisingController {
    constructor() {
        /**
         * Create ad campaign
         * @api POST /ads/campaigns
         * @apiName API-AD-001
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-02
         */
        this.createCampaign = async (req, res, next) => {
            try {
                const creatorId = req.user.id;
                const campaign = await this.adService.createCampaign(req.body, creatorId);
                res.status(201).json({ success: true, data: campaign });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Serve ad for zone
         * @api GET /ads/serve/:zone
         * @apiName API-AD-002
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-07
         */
        this.getAdForZone = async (req, res, next) => {
            try {
                const { zone } = req.params;
                const ad = await this.adService.getAdForZone(zone);
                if (!ad) {
                    // 204 No Content is appropriate if no ad is available to serve
                    res.status(204).send();
                    return;
                }
                res.status(200).json({ success: true, data: ad });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Track ad click
         * @api GET /ads/track/:id
         * @apiName API-AD-003
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-07
         */
        this.trackClick = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.adService.trackClick(id);
                // If a destination URL is provided in query, redirect user there
                const redirectUrl = req.query.url;
                if (redirectUrl) {
                    res.redirect(redirectUrl);
                }
                else {
                    res.status(200).json({ success: true, message: 'Click tracked' });
                }
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update ad campaign
         * @api PUT /ads/campaigns/:id
         * @apiName API-AD-004
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-02
         */
        this.updateCampaign = async (req, res, next) => {
            try {
                const { id } = req.params;
                const updates = req.body;
                const campaign = await this.adService.updateCampaign(id, updates);
                if (!campaign) {
                    res.status(404).json({ success: false, message: 'Campaign not found' });
                    return;
                }
                res.status(200).json({ success: true, data: campaign });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete ad campaign
         * @api DELETE /ads/campaigns/:id
         * @apiName API-AD-005
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-02
         */
        this.deleteCampaign = async (req, res, next) => {
            try {
                const { id } = req.params;
                const success = await this.adService.deleteCampaign(id);
                if (!success) {
                    res.status(404).json({ success: false, message: 'Campaign not found' });
                    return;
                }
                res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get active campaigns
         * @api GET /ads/campaigns/active
         * @apiName API-AD-006
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-02
         */
        this.getActiveCampaigns = async (req, res, next) => {
            try {
                const user = req.user;
                // If advertiser, filter by their ID. If admin, optional filter? 
                // Assuming for now this endpoint is for the logged-in advertiser to see THEIR active campaigns.
                // If admin wants all, they might use a different endpoint or query param.
                // Let's assume generic "get my active campaigns" for advertiser.
                const advertiserId = user.userType === 'advertiser' ? user.id : undefined;
                const campaigns = await this.adService.getActiveCampaigns(advertiserId);
                res.status(200).json({ success: true, data: campaigns });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get pending campaigns
         * @api GET /ads/campaigns/pending
         * @apiName API-AD-007
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-02
         */
        this.getPendingCampaigns = async (req, res, next) => {
            try {
                const user = req.user;
                const advertiserId = user.userType === 'advertiser' ? user.id : undefined;
                const campaigns = await this.adService.getPendingCampaigns(advertiserId);
                res.status(200).json({ success: true, data: campaigns });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get expired campaigns
         * @api GET /ads/campaigns/expired
         * @apiName API-AD-008
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-02
         */
        this.getExpiredCampaigns = async (req, res, next) => {
            try {
                const user = req.user;
                const advertiserId = user.userType === 'advertiser' ? user.id : undefined;
                const campaigns = await this.adService.getExpiredCampaigns(advertiserId);
                res.status(200).json({ success: true, data: campaigns });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get advertiser reports
         * @api GET /ads/reports
         * @apiName API-AD-009
         * @apiGroup Advertisements
         * @srsRequirement REQ-ADV-05
         */
        this.getAdvertiserReports = async (req, res, next) => {
            try {
                const user = req.user;
                const advertiserId = user.id;
                const reportData = await this.adService.getAdvertiserReports(advertiserId);
                res.status(200).json({ success: true, data: reportData });
            }
            catch (error) {
                next(error);
            }
        };
        this.adService = new services_1.AdvertisingService();
    }
}
exports.AdvertisingController = AdvertisingController;
//# sourceMappingURL=AdvertisingController.js.map