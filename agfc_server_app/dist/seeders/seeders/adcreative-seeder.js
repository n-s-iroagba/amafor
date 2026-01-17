"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreativeSeeder = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const adcreatives_1 = require("../data/development/adcreatives");
const adcreatives_2 = require("../data/production/adcreatives");
const adcreatives_3 = require("../data/testing/adcreatives");
const AdCreative_1 = __importDefault(require("@models/AdCreative"));
const base_seeder_1 = require("./base-seeder");
class AdCreativeSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(AdCreative_1.default, 'adcreative');
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
            return adcreatives_2.productionAdCreatives || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return adcreatives_3.testAdCreatives || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return adcreatives_1.developmentAdCreatives || [];
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
exports.AdCreativeSeeder = AdCreativeSeeder;
//# sourceMappingURL=adcreative-seeder.js.map