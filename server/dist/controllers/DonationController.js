"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationController = void 0;
const services_1 = require("../services");
class DonationController {
    constructor() {
        /**
         * Initiate donation
         * @api POST /donations/initiate
         * @apiName API-DONATION-001
         * @apiGroup Donations
         * @srsRequirement REQ-DON-01
         */
        this.initiateDonation = async (req, res, next) => {
            try {
                const { amount, email, metadata } = req.body;
                const result = await this.donationService.initiateDonation(amount, email, metadata);
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Handle payment webhook
         * @api POST /donations/webhook
         * @apiName API-DONATION-002
         * @apiGroup Donations
         * @srsRequirement REQ-DON-01
         */
        this.handleWebhook = async (req, res, next) => {
            try {
                const signature = req.headers['x-paystack-signature'];
                await this.donationService.processWebhook(req.body, signature);
                res.status(200).send('Webhook received');
            }
            catch (error) {
                // Don't expose internal errors to webhook caller, just log
                next(error);
            }
        };
        /**
         * Get public donor wall
         * @api GET /donations/wall
         * @apiName API-DONATION-003
         * @apiGroup Donations
         * @srsRequirement REQ-DON-01
         */
        this.getDonorWall = async (req, res, next) => {
            try {
                const donors = await this.donationService.getDonorWall(10);
                res.status(200).json({ success: true, data: donors });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * List donations (admin)
         * @api GET /donations
         * @apiName API-DONATION-004
         * @apiGroup Donations
         * @srsRequirement REQ-DON-01
         */
        this.listDonations = async (req, res, next) => {
            try {
                const donations = await this.donationService.listDonations(req.query);
                res.status(200).json({ success: true, data: donations });
            }
            catch (error) {
                next(error);
            }
        };
        this.donationService = new services_1.DonationService();
    }
}
exports.DonationController = DonationController;
//# sourceMappingURL=DonationController.js.map