"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCampaignSeeder = void 0;
const AdCampaign_1 = require("@models/AdCampaign");
const logger_1 = __importDefault(require("../../utils/logger"));
const adcampaigns_1 = require("../data/development/adcampaigns");
const adcampaigns_2 = require("../data/production/adcampaigns");
const adcampaigns_3 = require("../data/testing/adcampaigns");
const base_seeder_1 = require("./base-seeder");
class AdCampaignSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(AdCampaign_1.AdCampaign, 'adcampaign');
    }
    async getData(environment) {
        logger_1.default.info(`Loading ${this.name} data for ${environment} environment`);
        switch (environment) {
            case 'production':
                return await this.getProductionData();
            case 'test':
                return this.getTestData();
            case 'development':
            default:
                return this.getDevelopmentData();
        }
    }
    async getProductionData() {
        try {
            return adcampaigns_2.productionAdCampaigns || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return adcampaigns_3.testAdCampaigns || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return adcampaigns_1.developmentAdCampaigns || [];
        }
        catch (error) {
            logger_1.default.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    async seed(options = {}) {
        return super.seed(options);
    }
}
exports.AdCampaignSeeder = AdCampaignSeeder;
//# sourceMappingURL=adcampaign-seeder.js.map