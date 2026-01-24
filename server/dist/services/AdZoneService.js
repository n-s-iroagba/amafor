"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdZoneService = void 0;
const AdZoneRepository_1 = require("../repositories/AdZoneRepository");
const utils_1 = require("../utils");
class AdZoneService {
    constructor() {
        this.adZoneRepository = new AdZoneRepository_1.AdZoneRepository();
    }
    async getAllZones() {
        return utils_1.tracer.startActiveSpan('service.AdZoneService.getAllZones', async (span) => {
            try {
                const zones = await this.adZoneRepository.findAll();
                span.setAttribute('count', zones.length);
                return zones;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getActiveZones() {
        return utils_1.tracer.startActiveSpan('service.AdZoneService.getActiveZones', async (span) => {
            try {
                const zones = await this.adZoneRepository.findActiveZones();
                return zones;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getZoneStats() {
        return await this.adZoneRepository.getZoneStats();
    }
}
exports.AdZoneService = AdZoneService;
//# sourceMappingURL=AdZoneService.js.map