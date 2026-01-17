"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademyStaffSeeder = void 0;
const AcademyStaff_1 = __importDefault(require("@models/AcademyStaff"));
const logger_1 = __importDefault(require("@utils/logger"));
const academystaffs_1 = require("../data/development/academystaffs");
const academystaffs_2 = require("../data/production/academystaffs");
const academystaffs_3 = require("../data/testing/academystaffs");
const base_seeder_1 = require("./base-seeder");
class AcademyStaffSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(AcademyStaff_1.default, 'academy-staff');
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
            return academystaffs_2.productionAcademyStaffs || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return academystaffs_3.testAcademyStaffs || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return academystaffs_1.developmentAcademyStaff || [];
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
exports.AcademyStaffSeeder = AcademyStaffSeeder;
//# sourceMappingURL=academy-staff-seeder.js.map