// repositories/AdCreativeRepository.ts

import AdCampaign, { AdZone } from '@models/AdCampaign';
import { AdCreative, AdCreativeAttributes, AdCreativeCreationAttributes } from '@models/AdCreative';
import { WhereOptions, Op } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import { AdZoneRepository } from './AdZoneRepository';

export interface IAdCreativeRepository {
  // Standard CRUD (inherited from BaseRepository)
  findById(id: string): Promise<AdCreative | null>;
  findAll(options?: any): Promise<AdCreative[]>;
  findOne(options?: any): Promise<AdCreative | null>;
  create(data: AdCreativeCreationAttributes): Promise<AdCreative>;
  update(id: string, data: Partial<AdCreativeAttributes>): Promise<[number, AdCreative[]]>;
  delete(id: string): Promise<number>;
  count(options?: any): Promise<number>;
  paginate(page: number, limit: number, options?: any): Promise<any>;
  exists(id: string): Promise<boolean>;

  // AdCreative-specific methods
  findByCampaignId(campaignId: string): Promise<AdCreative[]>;
  findByZoneId(zoneId: string): Promise<AdCreative[]>;
  findByType(type: 'image' | 'video'): Promise<AdCreative[]>;
  findByFormat(format: string): Promise<AdCreative[]>;
  findActiveCreatives(zoneId?: string): Promise<AdCreative[]>;

  // Analytics and statistics
  getCreativeStats(campaignId?: string): Promise<{
    total: number;
    images: number;
    videos: number;
    totalViews: number;
    averageViews: number;
  }>;

  getTopPerformers(limit?: number): Promise<AdCreative[]>;
  getCreativesByCampaign(campaignId: string): Promise<AdCreative[]>;

  // Business logic
  incrementViews(id: string, count?: number): Promise<void>;
  resetViews(id: string): Promise<void>;
  updateCreativeUrl(id: string, url: string): Promise<void>;

  // Bulk operations
  bulkUpdateCampaignCreatives(campaignId: string, updates: Partial<AdCreativeAttributes>): Promise<number>;
  deleteByCampaignId(campaignId: string): Promise<number>;

  // Search and filtering
  searchCreatives(query: string): Promise<AdCreative[]>;
  filterByDimensions(minWidth?: number, minHeight?: number): Promise<AdCreative[]>;
}



export class AdCreativeRepository extends BaseRepository<AdCreative> implements IAdCreativeRepository {
  private adZoneRepository: AdZoneRepository
  constructor() {
    super(AdCreative);
    this.adZoneRepository = new AdZoneRepository()
  }

  // 🔍 Find by campaign ID
  async findByCampaignId(campaignId: string): Promise<AdCreative[]> {
    return await this.findAll({
      where: { campaignId },
      order: [['createdAt', 'DESC']]
    });
  }

  // 🔍 Find by zone ID
  async findByZoneId(zoneId: string): Promise<AdCreative[]> {
    return await this.findAll({
      where: { zoneId },
      order: [['createdAt', 'DESC']]
    });
  }

  // 🔍 Find by creative type
  async findByType(type: 'image' | 'video'): Promise<AdCreative[]> {
    return await this.findAll({
      where: { type },
      order: [['numberOfViews', 'DESC']]
    });
  }

  // 🔍 Find by format
  async findByFormat(format: string): Promise<AdCreative[]> {
    return await this.findAll({
      where: { format },
      order: [['createdAt', 'DESC']]
    });
  }

  // 🔍 Find active creatives (with campaign validation)
  async findActiveCreatives(zoneId?: string): Promise<AdCreative[]> {
    const where: WhereOptions<AdCreativeAttributes> = {
      ...(zoneId && { zoneId })
    };

    return await this.findAll({
      where,
      include: [{
        model: AdCampaign,
        as: 'campaign',
        where: {
          status: 'ACTIVE',
          [Op.and]: [
            {
              [Op.or]: [
                { startDate: { [Op.lte]: new Date() } },
                { startDate: null }
              ]
            },
            {
              [Op.or]: [
                { endDate: { [Op.gte]: new Date() } },
                { endDate: null }
              ]
            }
          ]
        },
        required: true
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  // 📊 Get creative statistics
  async getCreativeStats(campaignId?: string): Promise<{
    total: number;
    images: number;
    videos: number;
    totalViews: number;
    averageViews: number;
  }> {
    const where: WhereOptions<AdCreativeAttributes> = {};
    if (campaignId) {
      where.campaignId = campaignId;
    }

    const [total, images, videos, totalViews] = await Promise.all([
      this.count({ where }),
      this.count({ where: { ...where, type: 'image' } }),
      this.count({ where: { ...where, type: 'video' } }),
      this.model.sum('numberOfViews', { where: where as any })
    ]);

    const averageViews = total > 0 ? Math.round((totalViews || 0) / total) : 0;

    return {
      total,
      images,
      videos,
      totalViews: totalViews || 0,
      averageViews
    };
  }

  // 🏆 Get top performing creatives
  async getTopPerformers(limit: number = 10): Promise<AdCreative[]> {
    return await this.findAll({
      order: [['numberOfViews', 'DESC']],
      limit,
      include: [{
        model: AdCampaign,
        as: 'campaign',
        attributes: ['id', 'name', 'status']
      }]
    });
  }

  // 🔍 Get creatives by campaign with pagination
  async getCreativesByCampaign(campaignId: string): Promise<AdCreative[]> {
    return await this.findAll({
      where: { campaignId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: AdCampaign,
        as: 'campaign',
        attributes: ['id', 'name', 'budget']
      }]
    });
  }

  // 📈 Increment view count
  async incrementViews(id: string, count: number = 1): Promise<void> {
    await this.model.increment('numberOfViews', {
      by: count,
      where: { id }
    });

    // Also increment total views if needed
    await this.model.increment('views', {
      by: count,
      where: { id }
    });
  }

  // 🔄 Reset view count
  async resetViews(id: string): Promise<void> {
    await this.update(id, {
      numberOfViews: 0,
      views: 0
    });
  }

  // 🔗 Update creative URL
  async updateCreativeUrl(id: string, url: string): Promise<void> {
    await this.update(id, { url });
  }

  // 🔄 Bulk update creatives for a campaign
  async bulkUpdateCampaignCreatives(campaignId: string, updates: Partial<AdCreativeAttributes>): Promise<number> {
    const [affectedCount] = await this.model.update(updates, {
      where: { campaignId }
    });
    return affectedCount;
  }

  // 🗑️ Delete all creatives for a campaign
  async deleteByCampaignId(campaignId: string): Promise<number> {
    return await this.model.destroy({
      where: { campaignId }
    });
  }

  // 🔍 Search creatives by name or URL
  async searchCreatives(query: string): Promise<AdCreative[]> {
    return await this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { url: { [Op.iLike]: `%${query}%` } },
          { destinationUrl: { [Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
  }

  // 🔍 Filter by dimensions (assuming dimensions is JSON with width/height)
  async filterByDimensions(minWidth?: number, minHeight?: number): Promise<AdCreative[]> {
    const where: any = {};

    if (minWidth) {
      where.dimensions = {
        ...where.dimensions,
        width: { [Op.gte]: minWidth }
      };
    }

    if (minHeight) {
      where.dimensions = {
        ...where.dimensions,
        height: { [Op.gte]: minHeight }
      };
    }

    return await this.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  // 🎯 Override create to handle validation
  async create(data: AdCreativeCreationAttributes): Promise<AdCreative> {
    // Validate campaign exists
    const campaign = await AdCampaign.findByPk(data.campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${data.campaignId} not found`);
    }

    // Validate zone exists
    const zone = await this.adZoneRepository.findById(data.zoneId);
    if (!zone) {
      throw new Error(`Zone with ID ${data.zoneId} not found`);
    }

    // Validate type and format compatibility
    this.validateCreativeType(data.type, data.format);

    // Generate dimensions from format if not provided


    return await super.create(data);
  }

  // 🎯 Override update to handle validation
  async update(id: string, data: Partial<AdCreativeAttributes>): Promise<[number, AdCreative[]]> {
    // If updating type or format, validate compatibility
    if (data.type || data.format) {
      const creative = await this.findById(id);
      if (creative) {
        const type = data.type || creative.type;
        const format = data.format || creative.format;
        this.validateCreativeType(type, format);
      }
    }

    return await super.update(id, data);
  }

  // 🔧 Private helper methods
  private validateCreativeType(type: string, format: string): void {
    const validCombinations: Record<string, string[]> = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'webm', 'mov', 'avi']
    };

    if (!validCombinations[type]?.includes(format.toLowerCase())) {
      throw new Error(`Invalid format '${format}' for type '${type}'. Valid formats: ${validCombinations[type]?.join(', ')}`);
    }
  }

  private getDefaultDimensions(format: string): { width: number; height: number } {
    const dimensionsMap: Record<string, { width: number; height: number }> = {
      'jpg': { width: 800, height: 600 },
      'png': { width: 800, height: 600 },
      'mp4': { width: 1280, height: 720 },
      'webm': { width: 1280, height: 720 }
    };

    return dimensionsMap[format.toLowerCase()] || { width: 800, height: 600 };
  }
}