"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/article.routes.ts
const express_1 = require("express");
const ArticleController_1 = __importDefault(require("../controllers/ArticleController"));
// import { authMiddleware } from '@middleware/auth';
// import { roleMiddleware } from '@middleware/role';
// import { cacheMiddleware } from '@middleware/cache';
const express_rate_limit_1 = require("express-rate-limit");
const router = (0, express_1.Router)();
// Rate limiting for article endpoints
const articleLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
// Public routes (with rate limiting)
router.get('/homepage', articleLimiter, ArticleController_1.default.fetchHomepageArticles.bind(ArticleController_1.default));
router.get('/published', articleLimiter, ArticleController_1.default.fetchAllPublishedArticles.bind(ArticleController_1.default));
router.get('/tag/:tag', articleLimiter, ArticleController_1.default.getArticlesByTag.bind(ArticleController_1.default));
router.get('/search', articleLimiter, ArticleController_1.default.searchArticles.bind(ArticleController_1.default));
router.get('/popular-tags', articleLimiter, ArticleController_1.default.getPopularTags.bind(ArticleController_1.default));
router.get('/:id', articleLimiter, ArticleController_1.default.getArticleById.bind(ArticleController_1.default));
// // Admin routes (protected)
// router.post(
//   '/cache/invalidate',
//   authMiddleware,
//   roleMiddleware(['admin', 'editor', 'media_manager']),
//   articleController.invalidateCache.bind(articleController)
// );
// Cache middleware for specific routes (optional - using Redis in service layer)
// router.get('/homepage', cacheMiddleware('homepage_articles'), articleController.fetchHomepageArticles);
exports.default = router;
//# sourceMappingURL=articleRoutes.js.map