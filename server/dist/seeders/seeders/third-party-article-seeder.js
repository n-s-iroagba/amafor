"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedNewsSeeder = void 0;
// seeders/FeaturedNewsSeeder.ts
const FeaturedNews_1 = __importDefault(require("@models/FeaturedNews"));
const logger_1 = __importDefault(require("../../utils/logger"));
const featuredNewss_1 = require("../data/development/featuredNewss");
const base_seeder_1 = require("./base-seeder");
class FeaturedNewsSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(FeaturedNews_1.default, 'third_party_article');
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
            return featuredNewss_1.developmentFeaturedNewss || [];
        }
        catch (error) {
            logger_1.default.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
}
exports.FeaturedNewsSeeder = FeaturedNewsSeeder;
//# sourceMappingURL=third-party-article-seeder.js.map