"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueSeeder = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const leagues_1 = require("../data/development/leagues");
const leagues_2 = require("../data/production/leagues");
const leagues_3 = require("../data/testing/leagues");
const League_1 = __importDefault(require("@models/League"));
const base_seeder_1 = require("./base-seeder");
class LeagueSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(League_1.default, 'league');
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
            return leagues_2.productionLeagues || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return leagues_3.testLeagues || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return leagues_1.developmentLeagues || [];
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
exports.LeagueSeeder = LeagueSeeder;
//# sourceMappingURL=league-seeder.js.map