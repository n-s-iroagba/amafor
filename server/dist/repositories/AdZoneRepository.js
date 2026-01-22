"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdZoneRepository = void 0;
const AdZones_1 = __importDefault(require("@models/AdZones"));
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
class AdZoneRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(AdZones_1.default);
    }
    async findByZone(zone) {
        return await this.findOne({
            where: { zone }
        });
    }
    async findActiveZones() {
        return await this.findAll({
            where: { status: 'active' },
            order: [['pricePerView', 'ASC']]
        });
    }
    async findByType(type) {
        return await this.findAll({
            where: { type },
            order: [['pricePerView', 'ASC']]
        });
    }
    async updatePrice(zone, pricePerView) {
        const [affectedCount] = await this.update(zone, { pricePerView }, { where: { zone } });
        return affectedCount > 0;
    }
    async getZonePrice(zone) {
        const adZone = await this.findByZone(zone);
        return adZone ? adZone.pricePerView : null;
    }
    async getAvailableZonesForBudget(budget, impressions) {
        // Calculate maximum price per view based on budget and impressions
        const maxPricePerView = budget / impressions;
        return await this.findAll({
            where: {
                status: 'active',
                pricePerView: {
                    [sequelize_1.Op.lte]: Math.floor(maxPricePerView * 100) // Convert to kobo
                }
            },
            order: [['pricePerView', 'DESC']]
        });
    }
    async updateStatus(zone, status) {
        const [affectedCount] = await this.update(zone, { status }, { where: { zone } });
        return affectedCount > 0;
    }
    async getZoneStats() {
        const [total, active, inactive, allZones] = await Promise.all([
            this.count(),
            this.count({ where: { status: 'active' } }),
            this.count({ where: { status: 'inactive' } }),
            this.findAll({ attributes: ['pricePerView'] })
        ]);
        const totalPrice = allZones.reduce((sum, zone) => sum + zone.pricePerView, 0);
        const averagePrice = total > 0 ? Math.round(totalPrice / total) : 0;
        return {
            total,
            active,
            inactive,
            averagePrice
        };
    }
    // Override update to ensure only pricePerView can be updated
    async update(zone, data, options) {
        // Filter out fields that shouldn't be updated
        const updatableFields = ['pricePerView', 'updatedAt'];
        const filteredData = {};
        Object.keys(data).forEach(key => {
            if (updatableFields.includes(key)) {
                filteredData[key] = data[key];
            }
        });
        if (Object.keys(filteredData).length === 0) {
            throw new Error('Only pricePerView can be updated for AdZone');
        }
        return super.update(zone, filteredData, options);
    }
}
exports.AdZoneRepository = AdZoneRepository;
//# sourceMappingURL=AdZoneRepository.js.map