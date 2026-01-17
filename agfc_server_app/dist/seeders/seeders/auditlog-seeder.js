"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogSeeder = void 0;
const AuditLog_1 = require("@models/AuditLog");
const logger_1 = __importDefault(require("../../utils/logger"));
const auditlogs_1 = require("../data/development/auditlogs");
const auditlogs_2 = require("../data/production/auditlogs");
const auditlogs_3 = require("../data/testing/auditlogs");
const base_seeder_1 = require("./base-seeder");
class AuditLogSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(AuditLog_1.AuditLog, 'auditlog');
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
            return auditlogs_2.productionAuditLogs || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return auditlogs_3.testAuditLogs || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return auditlogs_1.developmentAuditLogs || [];
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
exports.AuditLogSeeder = AuditLogSeeder;
//# sourceMappingURL=auditlog-seeder.js.map