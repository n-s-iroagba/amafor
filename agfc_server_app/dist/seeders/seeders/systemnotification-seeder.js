"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemNotificationSeeder = void 0;
const SystemNotification_1 = require("@models/SystemNotification");
const logger_1 = __importDefault(require("../../utils/logger"));
const systemnotifications_1 = require("../data/development/systemnotifications");
const systemnotifications_2 = require("../data/production/systemnotifications");
const systemnotifications_3 = require("../data/testing/systemnotifications");
const base_seeder_1 = require("./base-seeder");
class SystemNotificationSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(SystemNotification_1.SystemNotification, 'systemnotification');
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
            return systemnotifications_2.productionSystemNotifications || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return systemnotifications_3.testSystemNotifications || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return systemnotifications_1.developmentSystemNotifications || [];
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
exports.SystemNotificationSeeder = SystemNotificationSeeder;
//# sourceMappingURL=systemnotification-seeder.js.map