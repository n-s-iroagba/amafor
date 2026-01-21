// services/VideoService.ts
import VideoRepository from '../repositories/VideoRepository';
import { NotFoundError, ValidationError } from '../utils/errors';
import { Op } from 'sequelize';



class VideoService {
  private videoRepository: VideoRepository;

  constructor() {
    this.videoRepository = new VideoRepository();
  }

  async getAllVideos(page: number = 1, limit: number = 10) {
    const result = await this.videoRepository.paginate(page, limit, {
      order: [['createdAt', 'DESC']]
    });
    return result;
  }

  async getVideoById(id: string) {
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

  async updateVideo(id: string, videoData: any) {
    const existingVideo = await this.videoRepository.findById(id);
    if (!existingVideo) {
      throw new NotFoundError(`Video with ID ${id} not found`);
    }

    const [count, updatedVideos] = await this.videoRepository.update(id, videoData);
    if (count === 0) {
      throw new Error('Failed to update video');
    }
    return updatedVideos[0];
  }

  async deleteVideo(id: string) {
    const existingVideo = await this.videoRepository.findById(id);
    if (!existingVideo) {
      throw new NotFoundError(`Video with ID ${id} not found`);
    }

    const deleted = await this.videoRepository.delete(id);
    return deleted;
  }

  async searchVideos(query: string) {
    const videos = await this.videoRepository.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { excerpt: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });
    return videos;
  }

  async getVideosByDuration(minDuration?: number, maxDuration?: number) {
    const whereClause: any = {};

    if (minDuration) {
      whereClause.duration = {
        ...whereClause.duration,
        [Op.gte]: minDuration,
      };
    }

    if (maxDuration) {
      whereClause.duration = {
        ...whereClause.duration,
        [Op.lte]: maxDuration,
      };
    }

    const videos = await this.videoRepository.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
    return videos;
  }
}

export default VideoService;