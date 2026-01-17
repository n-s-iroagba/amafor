"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronSubscriptionSeeder = void 0;
const PatronSubscription_1 = require("@models/PatronSubscription");
const logger_1 = __importDefault(require("../../utils/logger"));
const patronsubscriptions_1 = require("../data/development/patronsubscriptions");
const patronsubscriptions_2 = require("../data/production/patronsubscriptions");
const patronsubscriptions_3 = require("../data/testing/patronsubscriptions");
const base_seeder_1 = require("./base-seeder");
class PatronSubscriptionSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(PatronSubscription_1.PatronSubscription, 'patronsubscription');
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
            return patronsubscriptions_2.productionPatronSubscriptions || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return patronsubscriptions_3.testPatronSubscriptions || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return patronsubscriptions_1.developmentPatronSubscriptions || [];
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
exports.PatronSubscriptionSeeder = PatronSubscriptionSeeder;
//# sourceMappingURL=patronsubscription-seeder.js.map