"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdZoneService = void 0;
const AdZoneRepository_1 = require("@repositories/AdZoneRepository");
const errors_1 = require("@utils/errors");
const logger_1 = __importDefault(require("@utils/logger"));
class AdZoneService {
    constructor(repository) {
        this.repository = repository || new AdZoneRepository_1.AdZoneRepository();
    }
    async getAllZones() {
        try {
            const zones = await this.repository.findAll();
            return zones.map(zone => zone.toJSON());
        }
        catch (error) {
            logger_1.default.error('Failed to get all zones', { error: error.message });
            throw error;
        }
    }
    async getZoneByType(zone) {
        try {
            const adZone = await this.repository.findByZone(zone);
            if (!adZone) {
                throw new errors_1.AppError(`Zone ${zone} not found`, 404);
            }
            return adZone.toJSON();
        }
        catch (error) {
            logger_1.default.error('Failed to get zone', { zone, error: error.message });
            throw error;
        }
    }
    async getActiveZones() {
        try {
            const zones = await this.repository.findActiveZones();
            return zones.map(zone => zone.toJSON());
        }
        catch (error) {
            logger_1.default.error('Failed to get active zones', { error: error.message });
            throw error;
        }
    }
    async updateZonePrice(data) {
        try {
            const { zone, pricePerView, updatedBy } = data;
            // Validate price
            if (pricePerView < 1) {
                throw new errors_1.AppError('Price per view must be at least 1 kobo', 400);
            }
            // Check if zone exists
            const existingZone = await this.repository.findByZone(zone);
            if (!existingZone) {
                throw new errors_1.AppError(`Zone ${zone} not found`, 404);
            }
            // Update price
            const updated = await this.repository.updatePrice(zone, pricePerView);
            if (!updated) {
                throw new errors_1.AppError('Failed to update zone price', 500);
            }
            // Get updated zone
            const updatedZone = await this.repository.findByZone(zone);
            if (!updatedZone) {
                throw new errors_1.AppError('Failed to retrieve updated zone', 500);
            }
            logger_1.default.info('Zone price updated', {
                zone,
                oldPrice: existingZone.pricePerView,
                newPrice: pricePerView,
                updatedBy
            });
            return updatedZone.toJSON();
        }
        catch (error) {
            logger_1.default.error('Failed to update zone price', {
                error: error.message,
                data
            });
            throw error;
        }
    }
    async calculateCampaignCost(zone, impressions) {
        try {
            const adZone = await this.repository.findByZone(zone);
            if (!adZone) {
                throw new errors_1.AppError(`Zone ${zone} not found`, 404);
            }
            const costPerImpression = adZone.pricePerView; // In kobo
            const totalCost = costPerImpression * impressions; // In kobo
            // Convert to Naira for display
            const formattedCost = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN'
            }).format(totalCost / 100);
            return {
                totalCost,
                costPerImpression,
                formattedCost
            };
        }
        catch (error) {
            logger_1.default.error('Failed to calculate campaign cost', {
                zone,
                impressions,
                error: error.message
            });
            throw error;
        }
    }
    async checkZoneAvailability(data) {
        try {
            const { zone, budget, impressions } = data;
            const adZone = await this.repository.findByZone(zone);
            if (!adZone) {
                throw new errors_1.AppError(`Zone ${zone} not found`, 404);
            }
            const totalCost = adZone.pricePerView * impressions;
            const costPerImpression = adZone.pricePerView;
            const fitsBudget = totalCost <= budget * 100; // Convert budget to kobo
            return {
                zone: adZone.toJSON(),
                totalCost,
                costPerImpression,
                fitsBudget
            };
        }
        catch (error) {
            logger_1.default.error('Failed to check zone availability', {
                data,
                error: error.message
            });
            throw error;
        }
    }
    async getBestZoneForBudget(budget, impressions) {
        try {
            const availableZones = await this.repository.getAvailableZonesForBudget(budget, impressions);
            if (availableZones.length === 0) {
                return null;
            }
            // Select the zone with the highest price (best visibility)
            const bestZone = availableZones[0];
            const totalCost = bestZone.pricePerView * impressions;
            return {
                zone: bestZone.toJSON(),
                totalCost,
                costPerImpression: bestZone.pricePerView,
                fitsBudget: true
            };
        }
        catch (error) {
            logger_1.default.error('Failed to find best zone for budget', {
                budget,
                impressions,
                error: error.message
            });
            throw error;
        }
    }
    async getZoneStats() {
        try {
            const [stats, zones] = await Promise.all([
                this.repository.getZoneStats(),
                this.repository.findAll()
            ]);
            return {
                ...stats,
                zones: zones.map(zone => zone.toJSON())
            };
        }
        catch (error) {
            logger_1.default.error('Failed to get zone stats', { error: error.message });
            throw error;
        }
    }
}
exports.AdZoneService = AdZoneService;
//# sourceMappingURL=AdZoneService.js.map