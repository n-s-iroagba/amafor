// src/routes/article.routes.ts
import { Router } from 'express';
import articleController from '../controllers/ArticleController';
// import { authMiddleware } from '@middleware/auth';
// import { roleMiddleware } from '@middleware/role';
// import { cacheMiddleware } from '@middleware/cache';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting for article endpoints
const articleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes (with rate limiting)
router.get('/', articleLimiter, articleController.fetchAllPublishedArticles.bind(articleController));
router.get('/homepage', articleLimiter, articleController.fetchHomepageArticles.bind(articleController));
router.get('/published', articleLimiter, articleController.fetchAllPublishedArticles.bind(articleController));
router.get('/tag/:tag', articleLimiter, articleController.getArticlesByTag.bind(articleController));
router.get('/search', articleLimiter, articleController.searchArticles.bind(articleController));
router.get('/popular-tags', articleLimiter, articleController.getPopularTags.bind(articleController));
router.get('/analytics', articleLimiter, articleController.getAnalytics.bind(articleController));
router.get('/:id', articleLimiter, articleController.getArticleById.bind(articleController));

// Protected Routes (To be implemented with proper middleware later)
router.post('/', articleLimiter, articleController.createArticle.bind(articleController));
router.patch('/:id', articleLimiter, articleController.updateArticle.bind(articleController));
router.delete('/:id', articleLimiter, articleController.deleteArticle.bind(articleController));

// // Admin routes (protected)
// router.post(
//   '/cache/invalidate',
//   authMiddleware,
//   roleMiddleware(['admin', 'editor', 'media_manager']),
//   articleController.invalidateCache.bind(articleController)
// );

// Cache middleware for specific routes (optional - using Redis in service layer)
// router.get('/homepage', cacheMiddleware('homepage_articles'), articleController.fetchHomepageArticles);

export default router;