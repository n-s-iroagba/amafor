"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleSeeder = void 0;
const Article_1 = require("@models/Article");
const logger_1 = __importDefault(require("../../utils/logger"));
const articles_1 = require("../data/development/articles");
const articles_2 = require("../data/production/articles");
const articles_3 = require("../data/testing/articles");
const base_seeder_1 = require("./base-seeder");
class ArticleSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Article_1.Article, 'article');
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
            return articles_2.productionArticles || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return articles_3.testArticles || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return articles_1.developmentArticles || [];
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
exports.ArticleSeeder = ArticleSeeder;
//# sourceMappingURL=article-seeder.js.map