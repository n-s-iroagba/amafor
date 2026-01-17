"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronSeeder = void 0;
const Patron_1 = __importDefault(require("@models/Patron"));
const logger_1 = __importDefault(require("../../utils/logger"));
const patron_1 = require("../data/development/patron");
const patron_2 = require("../data/production/patron");
const base_seeder_1 = require("./base-seeder");
const patron_3 = require("../data/testing/patron");
class PatronSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Patron_1.default, 'patron');
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
            return patron_2.productionPatrons || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return patron_3.testPatrons || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return patron_1.developmentPatrons || [];
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
exports.PatronSeeder = PatronSeeder;
//# sourceMappingURL=patron.js.map