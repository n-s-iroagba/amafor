"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureSeeder = void 0;
const Fixture_1 = require("@models/Fixture");
const logger_1 = __importDefault(require("../../utils/logger"));
const fixtures_1 = require("../data/development/fixtures");
const fixtures_2 = require("../data/production/fixtures");
const fixtures_3 = require("../data/testing/fixtures");
const base_seeder_1 = require("./base-seeder");
class FixtureSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Fixture_1.Fixture, 'fixture');
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
            return fixtures_2.productionFixtures || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return fixtures_3.testFixtures || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return fixtures_1.developmentFixtures || [];
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
exports.FixtureSeeder = FixtureSeeder;
//# sourceMappingURL=fixture-seeder.js.map