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
        const offset = (page - 1) * limit;
        const result = await this.videoRepository.findAll({
            limit: String(limit), offset: String(limit),
            order: [['createdAt', 'DESC']]
        });
        return result;
    }
    async getVideoById(id) {
        const video = await this.videoRepository.findById(id);
        if (!video) {
            throw new errors_1.NotFoundError(`Video with ID ${id} not found`);
        }
        return video;
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
        const updatedVideo = await this.videoRepository.updateById(id, videoData);
        return updatedVideo;
    }
    async deleteVideo(id) {
        const existingVideo = await this.videoRepository.findById(id);
        if (!existingVideo) {
            throw new errors_1.NotFoundError(`Video with ID ${id} not found`);
        }
        const deleted = await this.videoRepository.deleteById(id);
        return deleted;
    }
}
exports.default = VideoService;
//# sourceMappingURL=VideoService.js.map