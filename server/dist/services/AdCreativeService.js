"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreativeService = void 0;
const AdCreativeRepository_1 = require("@repositories/AdCreativeRepository");
const logger_1 = __importDefault(require("@utils/logger"));
class AdCreativeService {
    constructor() {
        this.adCreativeRepository = new AdCreativeRepository_1.AdCreativeRepository();
    }
    async getAllAdCreatives() {
        return await this.adCreativeRepository.findAll();
    }
    async getAdCreativeById(id) {
        return await this.adCreativeRepository.findById(id);
    }
    async getAdCreativesByCampaign(campaignId) {
        return await this.adCreativeRepository.findAll({
            where: { campaignId }
        });
    }
    async getActiveAdCreatives() {
        return await this.adCreativeRepository.findAll({
            where: { status: 'active' }
        });
    }
    async createAdCreative(adCreativeData) {
        const adCreative = await this.adCreativeRepository.create(adCreativeData);
        logger_1.default.info('AdCreative created', { id: adCreative.id });
        return adCreative;
    }
    async updateAdCreative(id, adCreativeData) {
        const [affectedCount, updatedRecords] = await this.adCreativeRepository.update(id, adCreativeData);
        if (affectedCount === 0) {
            return null;
        }
        return updatedRecords[0] || null;
    }
    async deleteAdCreative(id) {
        const result = await this.adCreativeRepository.delete(id);
        return result > 0;
    }
    async incrementAdViews(id) {
        const ad = await this.adCreativeRepository.findById(id);
        if (ad) {
            await this.adCreativeRepository.update(id, {
                numberOfViews: ad.numberOfViews + 1
            });
        }
    }
}
exports.AdCreativeService = AdCreativeService;
//# sourceMappingURL=AdCreativeService.js.map