"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalSeeder = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const goals_1 = require("../data/development/goals");
const goals_2 = require("../data/production/goals");
const goals_3 = require("../data/testing/goals");
const Goal_1 = __importDefault(require("@models/Goal"));
const base_seeder_1 = require("./base-seeder");
class GoalSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Goal_1.default, 'goal');
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
            return goals_2.productionGoals || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return goals_3.testGoals || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return goals_1.developmentGoals || [];
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
exports.GoalSeeder = GoalSeeder;
//# sourceMappingURL=goal-seeder.js.map