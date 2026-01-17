"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationController = void 0;
const services_1 = require("../services");
class DonationController {
    constructor() {
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
        this.getDonorWall = async (req, res, next) => {
            try {
                const donors = await this.donationService.getDonorWall(10);
                res.status(200).json({ success: true, data: donors });
            }
            catch (error) {
                next(error);
            }
        };
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