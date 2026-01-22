"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSeeder = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const videos_1 = require("../data/development/videos");
const videos_2 = require("../data/production/videos");
const videos_3 = require("../data/testing/videos");
const Video_1 = __importDefault(require("@models/Video"));
const base_seeder_1 = require("./base-seeder");
class VideoSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Video_1.default, 'video');
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
            return videos_2.productionVideos || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return videos_3.testVideos || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return videos_1.developmentVideos || [];
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
exports.VideoSeeder = VideoSeeder;
//# sourceMappingURL=video-seeder.js.map