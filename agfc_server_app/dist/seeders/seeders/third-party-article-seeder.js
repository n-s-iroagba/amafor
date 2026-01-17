"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyArticleSeeder = void 0;
// seeders/ThirdPartyArticleSeeder.ts
const ThirdPartyArticle_1 = __importDefault(require("@models/ThirdPartyArticle"));
const logger_1 = __importDefault(require("../../utils/logger"));
const thirdPartyArticles_1 = require("../data/development/thirdPartyArticles");
const base_seeder_1 = require("./base-seeder");
class ThirdPartyArticleSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(ThirdPartyArticle_1.default, 'third_party_article');
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
            return thirdPartyArticles_1.developmentThirdPartyArticles || [];
        }
        catch (error) {
            logger_1.default.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
}
exports.ThirdPartyArticleSeeder = ThirdPartyArticleSeeder;
//# sourceMappingURL=third-party-article-seeder.js.map