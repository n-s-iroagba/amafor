"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const cloudinary_1 = require("cloudinary");
const Video_1 = __importDefault(require("../models/Video"));
class VideoController {
    static async getUploadSignature(req, res) {
        const { type } = req.query;
        const timestamp = Math.round(Date.now() / 1000);
        const folder = type === 'thumbnail' ? 'thumbnails' : 'videos';
        const resourceType = type === 'thumbnail' ? 'image' : 'video';
        const signature = cloudinary_1.v2.utils.api_sign_request({
            timestamp,
            folder,
            resource_type: resourceType,
        }, 'm-3QPiiFr44a6rV-5We4E0XmQL8');
        res.json({
            signature,
            timestamp,
            apiKey: '954851749813514',
            cloudName: 'dh2cpesxu',
        });
    }
    ;
    /**
     * List videos
     * @api GET /videos
     * @apiName API-VIDEO-002
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03, REQ-SCT-05
     */
    static async getAllVideos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { count, rows: videos } = await Video_1.default.findAndCountAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });
            return res.status(200).json({
                success: true,
                data: videos,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages: Math.ceil(count / limit),
                },
            });
        }
        catch (error) {
            console.error('Error fetching videos:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    /**
     * Upload video
     * @api POST /videos
     * @apiName API-VIDEO-001
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03, REQ-SCT-05
     */
    static async createVideo(req, res) {
        try {
            const { title, excerpt, thumbnail, videoUrl, duration } = req.body;
            // Validate required fields
            if (!title || !excerpt || !thumbnail || !videoUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Title, excerpt, thumbnail, and videoUrl are required fields',
                });
            }
            // Create video
            const video = await Video_1.default.create({
                title,
                excerpt,
                thumbnail,
                videoUrl,
                duration: duration || null,
            });
            return res.status(201).json({
                success: true,
                message: 'Video created successfully',
                data: video,
            });
        }
        catch (error) {
            console.error('Error creating video:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    /**
     * Update video metadata
     * @api PUT /videos/:id
     * @apiName API-VIDEO-004
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03
     */
    static async updateVideo(req, res) {
        try {
            const { id } = req.params;
            const { title, excerpt, thumbnail, videoUrl, duration } = req.body;
            // Find video
            const video = await Video_1.default.findByPk(id);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    message: 'Video not found',
                });
            }
            // Update video
            await video.update({
                ...(title !== undefined && { title }),
                ...(excerpt !== undefined && { excerpt }),
                ...(thumbnail !== undefined && { thumbnail }),
                ...(videoUrl !== undefined && { videoUrl }),
                ...(duration !== undefined && { duration }),
            });
            return res.status(200).json({
                success: true,
                message: 'Video updated successfully',
                data: video,
            });
        }
        catch (error) {
            console.error('Error updating video:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    /**
     * Delete video
     * @api DELETE /videos/:id
     * @apiName API-VIDEO-005
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03
     */
    static async deleteVideo(req, res) {
        try {
            const { id } = req.params;
            // Find video
            const video = await Video_1.default.findByPk(id);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    message: 'Video not found',
                });
            }
            // Delete video
            await video.destroy();
            return res.status(200).json({
                success: true,
                message: 'Video deleted successfully',
            });
        }
        catch (error) {
            console.error('Error deleting video:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
exports.VideoController = VideoController;
exports.default = new VideoController();
//# sourceMappingURL=VideoController.js.map