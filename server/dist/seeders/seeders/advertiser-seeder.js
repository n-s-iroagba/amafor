"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertiserSeeder = void 0;
// seeders/AdvertiserSeeder.ts
const Advertiser_1 = __importDefault(require("@models/Advertiser"));
const logger_1 = __importDefault(require("../../utils/logger"));
const advertiser_1 = require("../data/development/advertiser");
const base_seeder_1 = require("./base-seeder");
class AdvertiserSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Advertiser_1.default, 'advertiser');
    }
    async getData(environment) {
        logger_1.default.info(`Loading ${this.name} data for ${environment} environment`);
        switch (environment) {
            case 'production':
                return this.getDevelopmentData();
            case 'test':
                return [];
            case 'development':
            default:
                return this.getDevelopmentData();
        }
    }
    getDevelopmentData() {
        try {
            return advertiser_1.developmentAdvertisers || [];
        }
        catch (error) {
            logger_1.default.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
}
exports.AdvertiserSeeder = AdvertiserSeeder;
//# sourceMappingURL=advertiser-seeder.js.map