"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueStatisticsSeeder = void 0;
const LeagueStatistics_1 = require("@models/LeagueStatistics");
const logger_1 = __importDefault(require("../../utils/logger"));
const leaguestatistics_1 = require("../data/development/leaguestatistics");
const leaguestatisticss_1 = require("../data/production/leaguestatisticss");
const leaguestatisticss_2 = require("../data/testing/leaguestatisticss");
const base_seeder_1 = require("./base-seeder");
class LeagueStatisticsSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(LeagueStatistics_1.LeagueStatistics, 'leaguestatistics');
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
            return leaguestatisticss_1.productionLeagueStatisticss || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return leaguestatisticss_2.testLeagueStatisticss || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return leaguestatistics_1.developmentLeagueStatistics || [];
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
exports.LeagueStatisticsSeeder = LeagueStatisticsSeeder;
//# sourceMappingURL=leaguestatistics-seeder.js.map