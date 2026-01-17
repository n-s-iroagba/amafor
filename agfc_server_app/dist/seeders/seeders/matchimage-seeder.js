"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchImageSeeder = void 0;
;
const logger_1 = __importDefault(require("../../utils/logger"));
const matchimages_1 = require("../data/development/matchimages");
const matchimages_2 = require("../data/production/matchimages");
const matchimages_3 = require("../data/testing/matchimages");
const MatchImage_1 = __importDefault(require("@models/MatchImage"));
const base_seeder_1 = require("./base-seeder");
class MatchImageSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(MatchImage_1.default, 'matchimage');
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
            return matchimages_2.productionMatchImages || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return matchimages_3.testMatchImages || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return matchimages_1.developmentMatchImages || [];
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
exports.MatchImageSeeder = MatchImageSeeder;
//# sourceMappingURL=matchimage-seeder.js.map