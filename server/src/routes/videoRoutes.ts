// routes/videoRoutes.ts
import { Router } from 'express';



import { VideoController } from '../controllers/VideoController';

const router = Router();




router.get('/upload/signature', VideoController.getUploadSignature)


// GET /api/videos - Get all videos with pagination
router.get('/', VideoController.getAllVideos);



// POST /api/videos - Create new video
router.post('/', VideoController.createVideo);

// PUT /api/videos/:id - Update video by ID
router.put('/:id', VideoController.updateVideo);

// DELETE /api/videos/:id - Delete video by ID
router.delete('/:id', VideoController.deleteVideo);



export default router;