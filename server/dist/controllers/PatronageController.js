"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronageController = void 0;
const services_1 = require("../services"); // Ensure this exports the class you provided
class PatronageController {
    constructor() {
        /**
         * Create patron subscription
         * @api POST /patrons/subscribe
         * @apiName API-PATRON-001
         * @apiGroup Patronage
         * @srsRequirement REQ-SUP-02
         */
        this.subscribe = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { tier, amount } = req.body;
                const subscription = await this.patronageService.subscribeUser(userId, tier, amount);
                res.status(201).json({
                    success: true,
                    message: `Successfully subscribed to ${tier} tier`,
                    data: subscription
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * List all patrons
         * @api GET /patrons
         * @apiName API-PATRON-002
         * @apiGroup Patronage
         * @srsRequirement REQ-SUP-03, REQ-ADM-10
         */
        this.listPatrons = async (req, res, next) => {
            try {
                const patrons = await this.patronageService.listAllPatrons(req.query);
                res.status(200).json({
                    success: true,
                    data: patrons
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get patron details
         * @api GET /patrons/:id
         * @apiName API-PATRON-003
         * @apiGroup Patronage
         * @srsRequirement REQ-ADM-10
         */
        this.getPatronDetails = async (req, res, next) => {
            try {
                const { id } = req.params;
                const patron = await this.patronageService.getPatronById(id);
                res.status(200).json({
                    success: true,
                    data: patron
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update patron status
         * @api PATCH /patrons/:id/status
         * @apiName API-PATRON-004
         * @apiGroup Patronage
         * @srsRequirement REQ-ADM-10
         */
        this.updatePatronStatus = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const adminId = req.user.id;
                const patron = await this.patronageService.updatePatronStatus(id, status, adminId);
                res.status(200).json({
                    success: true,
                    message: 'Patron status updated successfully',
                    data: patron
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Cancel subscription
         * @api DELETE /patrons/:id
         * @apiName API-PATRON-005
         * @apiGroup Patronage
         * @srsRequirement REQ-ADM-10
         */
        this.cancelSubscription = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                await this.patronageService.cancelSubscription(id, userId);
                res.status(200).json({
                    success: true,
                    message: 'Subscription cancelled successfully'
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Check subscription status
         * @remarks This is a utility method not in API spec
         */
        this.checkStatus = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const status = await this.patronageService.checkSubscriptionStatus(userId);
                res.status(200).json({
                    success: true,
                    data: status
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * List available subscription packages
         * @api GET /patrons/packages
         * @apiName API-PATRON-006
         * @apiGroup Patronage
         */
        this.listPackages = async (req, res, next) => {
            try {
                const packages = await this.patronageService.getSubscriptionPackages();
                res.status(200).json({
                    success: true,
                    data: packages
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.patronageService = new services_1.PatronageService();
    }
}
exports.PatronageController = PatronageController;
//# sourceMappingURL=PatronageController.js.map