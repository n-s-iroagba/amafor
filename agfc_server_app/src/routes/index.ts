import { Router } from 'express';
import articleRoutes from './articleRoutes';
import videoRoutes from './videoRoutes';



const router = Router();

router.use('/articles',articleRoutes)
router.use('/videos', videoRoutes)
// router.use('/auth', authRoutes);



export default router;