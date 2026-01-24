"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedNewsController = void 0;
const FeaturedNewsService_1 = __importDefault(require("../services/FeaturedNewsService"));
class FeaturedNewsController {
    /**
     * Get homepage featured news
     * @api GET /featured-news/homepage
     */
    async getHomepageNews(req, res, next) {
        try {
            const news = await FeaturedNewsService_1.default.fetchHomepageFeaturedNews();
            res.status(200).json({
                success: true,
                data: news
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * List all news with pagination
     * @api GET /featured-news
     */
    async listNews(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await FeaturedNewsService_1.default.getAllNews(page, limit, req.query);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FeaturedNewsController = FeaturedNewsController;
//# sourceMappingURL=FeaturedNewsController.js.map