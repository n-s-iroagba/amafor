"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureStatisticsSeeder = void 0;
// seeders/FixtureStatisticsSeeder.ts
const FixtureStatistics_1 = __importDefault(require("@models/FixtureStatistics"));
const logger_1 = __importDefault(require("../../utils/logger"));
const fixtureStatistics_1 = require("../data/development/fixtureStatistics");
const base_seeder_1 = require("./base-seeder");
class FixtureStatisticsSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(FixtureStatistics_1.default, 'fixture_statistics');
    }
    async getData(environment) {
        logger_1.default.info(`Loading ${this.name} data for ${environment} environment`);
        switch (environment) {
            case 'production':
                return [];
            case 'test':
                return [];
            case 'development':
            default:
                return this.getDevelopmentData();
        }
    }
    getDevelopmentData() {
        try {
            return fixtureStatistics_1.developmentFixtureStatistics || [];
        }
        catch (error) {
            logger_1.default.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
}
exports.FixtureStatisticsSeeder = FixtureStatisticsSeeder;
//# sourceMappingURL=fixture-statistics-seeder.js.map