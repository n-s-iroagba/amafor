// routes/feeds.routes.ts
import { Router } from 'express';
import { FeedsController } from '../controllers/FeedsController';
import { validate } from '../middleware/validation';
import { 
  RssFeedSourceSchema, 
  FeedSourceIdParamSchema 
} from '../validations/rssFeed.schema';
// import { authenticateToken, authorizeRoles } from '../middleware/auth';


const router = Router();
const feedsController = new FeedsController();






// Admin routes
router.get(
  '/',
  // authenticateToken, 
  // authorizeRoles(['general-admin', 'sports-admin']), 
  feedsController.getFeedSources
);

router.post(
  '/', 
  // authenticateToken, 
  // authorizeRoles(['general-admin', 'sports-admin']), 
  // validate(RssFeedSourceSchema),
  feedsController.createFeedSource
);

router.get(
  '/:id', 
  // authenticateToken, 
  // authorizeRoles(['general-admin', 'sports-admin']), 
  // validate(FeedSourceIdParamSchema),
  feedsController.getFeedSource
);

router.put(
  '/:id', 
  // authenticateToken, 
  // authorizeRoles(['general-admin', 'sports-admin']), 
  // validate(FeedSourceIdParamSchema),
  // validate(RssFeedSourceSchema),
  feedsController.updateFeedSource
);

router.delete(
  '/:id', 
  // authenticateToken, 
  // authorizeRoles(['general-admin', 'sports-admin']), 
  // validate(FeedSourceIdParamSchema),
  feedsController.deleteFeedSource
);


export default router;