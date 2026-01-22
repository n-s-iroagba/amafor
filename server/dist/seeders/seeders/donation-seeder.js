"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationSeeder = void 0;
const Donation_1 = require("@models/Donation");
const logger_1 = __importDefault(require("../../utils/logger"));
const donations_1 = require("../data/development/donations");
const donations_2 = require("../data/production/donations");
const donations_3 = require("../data/testing/donations");
const base_seeder_1 = require("./base-seeder");
class DonationSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Donation_1.Donation, 'donation');
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
            return donations_2.productionDonations || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return donations_3.testDonations || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return donations_1.developmentDonations || [];
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
exports.DonationSeeder = DonationSeeder;
//# sourceMappingURL=donation-seeder.js.map