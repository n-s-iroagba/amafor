"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineupSeeder = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const lineup_1 = require("../data/development/lineup");
const lineups_1 = require("../data/production/lineups");
const lineups_2 = require("../data/testing/lineups");
const Lineup_1 = __importDefault(require("@models/Lineup"));
const base_seeder_1 = require("./base-seeder");
class LineupSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Lineup_1.default, 'lineup');
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
            return lineups_1.productionLineups || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return lineups_2.testLineups || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return lineup_1.developmentLineups || [];
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
exports.LineupSeeder = LineupSeeder;
//# sourceMappingURL=lineup-seeder.js.map