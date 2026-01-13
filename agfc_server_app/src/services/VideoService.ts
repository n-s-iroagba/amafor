// services/VideoService.ts
import VideoRepository from '../repositories/VideoRepository';
import { NotFoundError, ValidationError } from '../utils/errors';

class VideoService {
  private videoRepository: VideoRepository;

  constructor() {
    this.videoRepository = new VideoRepository();
  }

  async getAllVideos(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const result = await this.videoRepository.findAll({ 
     limit:String(limit), offset:String(limit) ,
      order: [['createdAt', 'DESC']]
    });
    return result;
  }

  async getVideoById(id: number) {
    const video = await this.videoRepository.findById(id);
    if (!video) {
      throw new NotFoundError(`Video with ID ${id} not found`);
    }
    return video;
  }

  async createVideo(videoData: any) {
    if (!videoData.title || !videoData.excerpt || !videoData.thumbnail || !videoData.videoUrl) {
      throw new ValidationError('Title, excerpt, thumbnail, and video URL are required');
    }

    const video = await this.videoRepository.create(videoData);
    return video;
  }

  async updateVideo(id: number, videoData: any) {
    const existingVideo = await this.videoRepository.findById(id);
    if (!existingVideo) {
      throw new NotFoundError(`Video with ID ${id} not found`);
    }

    const updatedVideo = await this.videoRepository.updateById(id, videoData);
    return updatedVideo;
  }

  async deleteVideo(id: number) {
    const existingVideo = await this.videoRepository.findById(id);
    if (!existingVideo) {
      throw new NotFoundError(`Video with ID ${id} not found`);
    }

    const deleted = await this.videoRepository.deleteById(id);
    return deleted;
  }
}

export default VideoService;