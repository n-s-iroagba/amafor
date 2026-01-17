"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSeeder = void 0;
const Payment_1 = __importDefault(require("@models/Payment"));
const logger_1 = __importDefault(require("../../utils/logger"));
const base_seeder_1 = require("./base-seeder");
const payment_1 = require("../data/development/payment");
const payment_2 = require("../data/production/payment");
const payment_3 = require("../data/testing/payment");
class PaymentSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Payment_1.default, 'Payment');
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
            return payment_2.productionPayments || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return payment_3.testPayments || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return payment_1.developmentPayments || [];
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
exports.PaymentSeeder = PaymentSeeder;
//# sourceMappingURL=payment-seeder.js.map