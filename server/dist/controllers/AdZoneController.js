"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdZoneController = void 0;
const AdZoneService_1 = require("../services/AdZoneService");
const tracer_1 = __importDefault(require("../utils/tracer"));
class AdZoneController {
    constructor() {
        /**
         * Get all Zones
         * @api GET /ads/zones
         */
        this.getAllZones = async (req, res, next) => {
            return tracer_1.default.startActiveSpan('controller.AdZoneController.getAllZones', async (span) => {
                try {
                    const zones = await this.adZoneService.getAllZones();
                    res.status(200).json({ success: true, data: zones });
                }
                catch (error) {
                    span.setStatus({ code: 2, message: error.message });
                    next(error);
                }
                finally {
                    span.end();
                }
            });
        };
        /**
         * Get Active Zones
         * @api GET /ads/zones/active
         */
        this.getActiveZones = async (req, res, next) => {
            try {
                const zones = await this.adZoneService.getActiveZones();
                res.status(200).json({ success: true, data: zones });
            }
            catch (error) {
                next(error);
            }
        };
        this.adZoneService = new AdZoneService_1.AdZoneService();
    }
}
exports.AdZoneController = AdZoneController;
//# sourceMappingURL=AdZoneController.js.map