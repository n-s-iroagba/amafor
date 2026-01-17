"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const cloudinary_1 = require("cloudinary");
const Video_1 = __importDefault(require("../models/Video"));
const sequelize_1 = require("sequelize");
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
     * Get all videos with pagination
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
     * Get single video by ID
     */
    static async getVideoById(req, res) {
        try {
            const { id } = req.params;
            const video = await Video_1.default.findByPk(id);
            if (!video) {
                return res.status(404).json({
                    success: false,
                    message: 'Video not found',
                });
            }
            return res.status(200).json({
                success: true,
                data: video,
            });
        }
        catch (error) {
            console.error('Error fetching video:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    /**
     * Create new video
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
     * Update video by ID
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
     * Delete video by ID
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
    /**
     * Search videos by title or excerpt
     */
    static async searchVideos(req, res) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required',
                });
            }
            const videos = await Video_1.default.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.iLike]: `%${q}%` } },
                        { excerpt: { [sequelize_1.Op.iLike]: `%${q}%` } },
                    ],
                },
                order: [['createdAt', 'DESC']],
            });
            return res.status(200).json({
                success: true,
                data: videos,
            });
        }
        catch (error) {
            console.error('Error searching videos:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    /**
     * Get videos with duration filter
     */
    static async getVideosByDuration(req, res) {
        try {
            const { minDuration, maxDuration } = req.query;
            const whereClause = {};
            if (minDuration) {
                whereClause.duration = {
                    ...whereClause.duration,
                    [sequelize_1.Op.gte]: parseInt(minDuration),
                };
            }
            if (maxDuration) {
                whereClause.duration = {
                    ...whereClause.duration,
                    [sequelize_1.Op.lte]: parseInt(maxDuration),
                };
            }
            const videos = await Video_1.default.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
            });
            return res.status(200).json({
                success: true,
                data: videos,
            });
        }
        catch (error) {
            console.error('Error fetching videos by duration:', error);
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