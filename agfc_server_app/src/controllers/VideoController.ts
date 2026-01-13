// controllers/videoController.ts
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Video from '../models/Video';
import { Op } from 'sequelize';


export class VideoController {

static async  getUploadSignature (req: Request, res: Response): Promise<void>  {
  const { type } = req.query;
  const timestamp = Math.round(Date.now() / 1000);

  const folder = type === 'thumbnail' ? 'thumbnails' : 'videos';
  const resourceType = type === 'thumbnail' ? 'image' : 'video';

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      resource_type: resourceType,
    },
    
'm-3QPiiFr44a6rV-5We4E0XmQL8'
  );

  res.json({
    signature,
    timestamp,
    apiKey: '954851749813514',
    cloudName: 'dh2cpesxu',
  });
};

  /**
   * Get all videos with pagination
   */
  static async getAllVideos(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: videos } = await Video.findAndCountAll({
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
    } catch (error) {
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
  static async getVideoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const video = await Video.findByPk(id);
      
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
    } catch (error) {
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
  static async createVideo(req: Request, res: Response) {
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
      const video = await Video.create({
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
    } catch (error) {
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
  static async updateVideo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, excerpt, thumbnail, videoUrl, duration } = req.body;

      // Find video
      const video = await Video.findByPk(id);
      
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
    } catch (error) {
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
  static async deleteVideo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Find video
      const video = await Video.findByPk(id);
      
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
    } catch (error) {
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
  static async searchVideos(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const videos = await Video.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${q}%` } },
            { excerpt: { [Op.iLike]: `%${q}%` } },
          ],
        },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        success: true,
        data: videos,
      });
    } catch (error) {
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
  static async getVideosByDuration(req: Request, res: Response) {
    try {
      const { minDuration, maxDuration } = req.query;

      const whereClause: any = {};
      
      if (minDuration) {
        whereClause.duration = {
          ...whereClause.duration,
          [Op.gte]: parseInt(minDuration as string),
        };
      }
      
      if (maxDuration) {
        whereClause.duration = {
          ...whereClause.duration,
          [Op.lte]: parseInt(maxDuration as string),
        };
      }

      const videos = await Video.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        success: true,
        data: videos,
      });
    } catch (error) {
      console.error('Error fetching videos by duration:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new VideoController();
  