"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisingController = void 0;
const services_1 = require("../services");
class AdvertisingController {
    constructor() {
        // Admin Only
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
        // Public (High Traffic)
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
        // Public (Tracking Pixel / Redirect)
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
        this.adService = new services_1.AdvertisingService();
    }
}
exports.AdvertisingController = AdvertisingController;
//# sourceMappingURL=AdvertisementController.js.map