"use strict";
// repositories/AdCreativeRepository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreativeRepository = void 0;
const AdCampaign_1 = __importDefault(require("@models/AdCampaign"));
const AdCreative_1 = require("@models/AdCreative");
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const AdZoneRepository_1 = require("./AdZoneRepository");
class AdCreativeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(AdCreative_1.AdCreative);
        this.adZoneRepository = new AdZoneRepository_1.AdZoneRepository();
    }
    // 🔍 Find by campaign ID
    async findByCampaignId(campaignId) {
        return await this.findAll({
            where: { campaignId },
            order: [['createdAt', 'DESC']]
        });
    }
    // 🔍 Find by zone ID
    async findByZoneId(zoneId) {
        return await this.findAll({
            where: { zoneId },
            order: [['createdAt', 'DESC']]
        });
    }
    // 🔍 Find by creative type
    async findByType(type) {
        return await this.findAll({
            where: { type },
            order: [['numberOfViews', 'DESC']]
        });
    }
    // 🔍 Find by format
    async findByFormat(format) {
        return await this.findAll({
            where: { format },
            order: [['createdAt', 'DESC']]
        });
    }
    // 🔍 Find active creatives (with campaign validation)
    async findActiveCreatives(zoneId) {
        const where = {
            ...(zoneId && { zoneId })
        };
        return await this.findAll({
            where,
            include: [{
                    model: AdCampaign_1.default,
                    as: 'campaign',
                    where: {
                        status: 'ACTIVE',
                        [sequelize_1.Op.and]: [
                            {
                                [sequelize_1.Op.or]: [
                                    { startDate: { [sequelize_1.Op.lte]: new Date() } },
                                    { startDate: null }
                                ]
                            },
                            {
                                [sequelize_1.Op.or]: [
                                    { endDate: { [sequelize_1.Op.gte]: new Date() } },
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
    async getCreativeStats(campaignId) {
        const where = {};
        if (campaignId) {
            where.campaignId = campaignId;
        }
        const [total, images, videos, totalViews] = await Promise.all([
            this.count({ where }),
            this.count({ where: { ...where, type: 'image' } }),
            this.count({ where: { ...where, type: 'video' } }),
            this.model.sum('numberOfViews', { where: where })
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
    async getTopPerformers(limit = 10) {
        return await this.findAll({
            order: [['numberOfViews', 'DESC']],
            limit,
            include: [{
                    model: AdCampaign_1.default,
                    as: 'campaign',
                    attributes: ['id', 'name', 'status']
                }]
        });
    }
    // 🔍 Get creatives by campaign with pagination
    async getCreativesByCampaign(campaignId) {
        return await this.findAll({
            where: { campaignId },
            order: [['createdAt', 'DESC']],
            include: [{
                    model: AdCampaign_1.default,
                    as: 'campaign',
                    attributes: ['id', 'name', 'budget']
                }]
        });
    }
    // 📈 Increment view count
    async incrementViews(id, count = 1) {
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
    async resetViews(id) {
        await this.update(id, {
            numberOfViews: 0,
            views: 0
        });
    }
    // 🔗 Update creative URL
    async updateCreativeUrl(id, url) {
        await this.update(id, { url });
    }
    // 🔄 Bulk update creatives for a campaign
    async bulkUpdateCampaignCreatives(campaignId, updates) {
        const [affectedCount] = await this.model.update(updates, {
            where: { campaignId }
        });
        return affectedCount;
    }
    // 🗑️ Delete all creatives for a campaign
    async deleteByCampaignId(campaignId) {
        return await this.model.destroy({
            where: { campaignId }
        });
    }
    // 🔍 Search creatives by name or URL
    async searchCreatives(query) {
        return await this.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { name: { [sequelize_1.Op.iLike]: `%${query}%` } },
                    { url: { [sequelize_1.Op.iLike]: `%${query}%` } },
                    { destinationUrl: { [sequelize_1.Op.iLike]: `%${query}%` } }
                ]
            },
            order: [['createdAt', 'DESC']]
        });
    }
    // 🔍 Filter by dimensions (assuming dimensions is JSON with width/height)
    async filterByDimensions(minWidth, minHeight) {
        const where = {};
        if (minWidth) {
            where.dimensions = {
                ...where.dimensions,
                width: { [sequelize_1.Op.gte]: minWidth }
            };
        }
        if (minHeight) {
            where.dimensions = {
                ...where.dimensions,
                height: { [sequelize_1.Op.gte]: minHeight }
            };
        }
        return await this.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
    }
    // 🎯 Override create to handle validation
    async create(data) {
        // Validate campaign exists
        const campaign = await AdCampaign_1.default.findByPk(data.campaignId);
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
    async update(id, data) {
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
    validateCreativeType(type, format) {
        const validCombinations = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            video: ['mp4', 'webm', 'mov', 'avi']
        };
        if (!validCombinations[type]?.includes(format.toLowerCase())) {
            throw new Error(`Invalid format '${format}' for type '${type}'. Valid formats: ${validCombinations[type]?.join(', ')}`);
        }
    }
    getDefaultDimensions(format) {
        const dimensionsMap = {
            'jpg': { width: 800, height: 600 },
            'png': { width: 800, height: 600 },
            'mp4': { width: 1280, height: 720 },
            'webm': { width: 1280, height: 720 }
        };
        return dimensionsMap[format.toLowerCase()] || { width: 800, height: 600 };
    }
}
exports.AdCreativeRepository = AdCreativeRepository;
//# sourceMappingURL=AdCreativeRepository.js.map