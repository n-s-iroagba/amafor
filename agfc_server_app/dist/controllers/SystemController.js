"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemController = void 0;
const services_1 = require("../services");
class SystemController {
    constructor() {
        this.getHealth = async (req, res, next) => {
            try {
                const status = await this.systemService.getHealthStatus();
                res.status(200).json(status);
            }
            catch (error) {
                next(error);
            }
        };
        this.getCookieConsent = async (req, res, next) => {
            try {
                const config = await this.systemService.getCookieConsentConfig();
                res.status(200).json({ success: true, data: config });
            }
            catch (error) {
                next(error);
            }
        };
        this.systemService = new services_1.SystemService();
    }
}
exports.SystemController = SystemController;
//# sourceMappingURL=SystemController.js.map