"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/VideoService.ts
const VideoRepository_1 = __importDefault(require("../repositories/VideoRepository"));
const errors_1 = require("../utils/errors");
class VideoService {
    constructor() {
        this.videoRepository = new VideoRepository_1.default();
    }
    async getAllVideos(page = 1, limit = 10) {
        const result = await this.videoRepository.paginate(page, limit, {
            order: [['createdAt', 'DESC']]
        });
        return result;
    }
    async createVideo(videoData) {
        if (!videoData.title || !videoData.excerpt || !videoData.thumbnail || !videoData.videoUrl) {
            throw new errors_1.ValidationError('Title, excerpt, thumbnail, and video URL are required');
        }
        const video = await this.videoRepository.create(videoData);
        return video;
    }
    async updateVideo(id, videoData) {
        const existingVideo = await this.videoRepository.findById(id);
        if (!existingVideo) {
            throw new errors_1.NotFoundError(`Video with ID ${id} not found`);
        }
        const [count, updatedVideos] = await this.videoRepository.update(id, videoData);
        if (count === 0) {
            throw new Error('Failed to update video');
        }
        return updatedVideos[0];
    }
    async deleteVideo(id) {
        const existingVideo = await this.videoRepository.findById(id);
        if (!existingVideo) {
            throw new errors_1.NotFoundError(`Video with ID ${id} not found`);
        }
        const deleted = await this.videoRepository.delete(id);
        return deleted;
    }
}
exports.default = VideoService;
//# sourceMappingURL=VideoService.js.map