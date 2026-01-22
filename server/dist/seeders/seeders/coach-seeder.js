"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachSeeder = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const coachs_1 = require("../data/development/coachs");
const coachs_2 = require("../data/production/coachs");
const coachs_3 = require("../data/testing/coachs");
const Coach_1 = __importDefault(require("@models/Coach"));
const base_seeder_1 = require("./base-seeder");
class CoachSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Coach_1.default, 'coach');
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
            return coachs_2.productionCoachs || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return coachs_3.testCoachs || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return coachs_1.developmentCoaches || [];
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
exports.CoachSeeder = CoachSeeder;
//# sourceMappingURL=coach-seeder.js.map