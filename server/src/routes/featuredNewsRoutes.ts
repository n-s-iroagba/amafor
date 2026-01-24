import { Router } from 'express';
import { FeaturedNewsController } from '../controllers/FeaturedNewsController';
// import { authenticate } from '../middleware/auth'; 

const router = Router();
const controller = new FeaturedNewsController();

// Public routes
router.get('/homepage', controller.getHomepageNews);
router.get('/', controller.listNews);

export default router;
