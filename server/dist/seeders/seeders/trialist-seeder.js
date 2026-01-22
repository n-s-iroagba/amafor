"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialistSeeder = void 0;
const Trialist_1 = require("@models/Trialist");
const logger_1 = __importDefault(require("../../utils/logger"));
const trialists_1 = require("../data/development/trialists");
const trialists_2 = require("../data/production/trialists");
const trialists_3 = require("../data/testing/trialists");
const base_seeder_1 = require("./base-seeder");
class TrialistSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Trialist_1.Trialist, 'trialist');
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
            return trialists_2.productionTrialists || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return trialists_3.testTrialists || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return trialists_1.developmentTrialists || [];
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
exports.TrialistSeeder = TrialistSeeder;
//# sourceMappingURL=trialist-seeder.js.map