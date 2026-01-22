"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSeeder = void 0;
const User_1 = require("@models/User");
const logger_1 = __importDefault(require("../../utils/logger"));
const users_1 = require("../data/development/users");
const users_2 = require("../data/production/users");
const users_3 = require("../data/testing/users");
const base_seeder_1 = require("./base-seeder");
class UserSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(User_1.User, 'user');
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
            return users_2.productionUsers || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return users_3.testUsers || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return users_1.developmentUsers || [];
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
exports.UserSeeder = UserSeeder;
//# sourceMappingURL=user-seeder.js.map