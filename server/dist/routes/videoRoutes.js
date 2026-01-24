"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/videoRoutes.ts
const express_1 = require("express");
const VideoController_1 = require("../controllers/VideoController");
const router = (0, express_1.Router)();
router.get('/upload/signature', VideoController_1.VideoController.getUploadSignature);
// GET /api/videos - Get all videos with pagination
router.get('/', VideoController_1.VideoController.getAllVideos);
// POST /api/videos - Create new video
router.post('/', VideoController_1.VideoController.createVideo);
// PUT /api/videos/:id - Update video by ID
router.put('/:id', VideoController_1.VideoController.updateVideo);
// DELETE /api/videos/:id - Delete video by ID
router.delete('/:id', VideoController_1.VideoController.deleteVideo);
exports.default = router;
//# sourceMappingURL=videoRoutes.js.map