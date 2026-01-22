"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedSourceSeeder = void 0;
const RssFeedSource_1 = require("@models/RssFeedSource");
const logger_1 = __importDefault(require("../../utils/logger"));
const rssfeedsources_1 = require("../data/development/rssfeedsources");
const rssfeedsources_2 = require("../data/production/rssfeedsources");
const rssfeedsources_3 = require("../data/testing/rssfeedsources");
const base_seeder_1 = require("./base-seeder");
class RssFeedSourceSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(RssFeedSource_1.RssFeedSource, 'rssfeedsource');
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
            return rssfeedsources_2.productionRssFeedSources || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return rssfeedsources_3.testRssFeedSources || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return rssfeedsources_1.developmentRssFeedSources || [];
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
exports.RssFeedSourceSeeder = RssFeedSourceSeeder;
//# sourceMappingURL=rssfeedsource-seeder.js.map