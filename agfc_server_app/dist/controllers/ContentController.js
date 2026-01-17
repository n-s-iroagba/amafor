"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const services_1 = require("../services");
class ContentController {
    constructor() {
        this.createArticle = async (req, res, next) => {
            try {
                const authorId = req.user.id;
                const article = await this.contentService.createArticle(req.body, authorId);
                res.status(201).json({ success: true, data: article });
            }
            catch (error) {
                next(error);
            }
        };
        this.publishArticle = async (req, res, next) => {
            try {
                const { id } = req.params;
                const adminId = req.user.id;
                const article = await this.contentService.publishArticle(id, adminId);
                res.status(200).json({ success: true, data: article });
            }
            catch (error) {
                next(error);
            }
        };
        this.getPublicNews = async (req, res, next) => {
            try {
                const news = await this.contentService.getPublicNews(req.query);
                res.status(200).json({ success: true, data: news });
            }
            catch (error) {
                next(error);
            }
        };
        this.getArticleDetails = async (req, res, next) => {
            try {
                const { id } = req.params;
                const article = await this.contentService.getArticleDetails(id);
                if (!article)
                    throw new Error('Article not found');
                res.status(200).json({ success: true, data: article });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteArticle = async (req, res, next) => {
            try {
                const { id } = req.params;
                const adminId = req.user.id;
                await this.contentService.deleteArticle(id, adminId);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.contentService = new services_1.ContentService();
    }
}
exports.ContentController = ContentController;
//# sourceMappingURL=ContentController.js.map