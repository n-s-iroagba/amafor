"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronageController = void 0;
const services_1 = require("../services"); // Ensure this exports the class you provided
class PatronageController {
    constructor() {
        this.subscribe = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { tier, amount } = req.body;
                // Service expects: (userId, tier, amount)
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
        this.checkStatus = async (req, res, next) => {
            try {
                const userId = req.user.id;
                // Service expects: (userId)
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
        this.patronageService = new services_1.PatronageService();
    }
}
exports.PatronageController = PatronageController;
//# sourceMappingURL=PatronageController.js.map