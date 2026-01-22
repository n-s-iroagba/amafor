"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisingService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
class AdvertisingService {
    constructor() {
        this.adRepository = new repositories_1.AdCampaignRepository();
    }
    async createCampaign(data, advertiserId) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.createCampaign', async (span) => {
            try {
                const campaign = await this.adRepository.create({
                    ...data,
                    advertiserId,
                    status: 'PENDING_PAYMENT',
                    currentImpressions: 0,
                    currentClicks: 0
                });
                utils_1.structuredLogger.business('AD_CAMPAIGN_CREATED', data.budget || 0, advertiserId, {
                    campaignId: campaign.id,
                    zone: data.id
                });
                return campaign;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateCampaign(id, updates) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.updateCampaign', async (span) => {
            try {
                span.setAttribute('campaignId', id);
                const campaign = await this.adRepository.findById(id);
                if (!campaign) {
                    return null;
                }
                const [updatedCount] = await this.adRepository.update(id, updates);
                if (updatedCount === 0 && Object.keys(updates).length > 0) {
                    // If we tried to update but nothing changed (maybe no fields passed?), just return original.
                    // But if updates were passed and count is 0, it might mean DB error or no row found (but we checked findById).
                    // It usually means values were same.
                }
                const updatedCampaign = await this.adRepository.findById(id);
                utils_1.structuredLogger.business('AD_CAMPAIGN_UPDATED', 0, campaign.advertiserId, {
                    campaignId: id,
                    updates: Object.keys(updates)
                });
                return updatedCampaign;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async deleteCampaign(id) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.deleteCampaign', async (span) => {
            try {
                span.setAttribute('campaignId', id);
                const deletedCount = await this.adRepository.delete(id);
                return deletedCount > 0;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getActiveCampaigns(advertiserId) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.getActiveCampaigns', async (span) => {
            try {
                const where = {
                    status: 'active',
                    startDate: { [sequelize_1.Op.lte]: new Date() },
                    endDate: { [sequelize_1.Op.gte]: new Date() }
                };
                if (advertiserId) {
                    where.advertiserId = advertiserId;
                }
                return await this.adRepository.findAll({ where });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getExpiredCampaigns(advertiserId) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.getExpiredCampaigns', async (span) => {
            try {
                const where = {
                    endDate: { [sequelize_1.Op.lt]: new Date() }
                };
                if (advertiserId) {
                    where.advertiserId = advertiserId;
                }
                return await this.adRepository.findAll({ where });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getPendingCampaigns(advertiserId) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.getPendingCampaigns', async (span) => {
            try {
                const where = {
                    status: { [sequelize_1.Op.in]: ['DRAFT', 'PENDING_PAYMENT'] }
                };
                if (advertiserId) {
                    where.advertiserId = advertiserId;
                }
                return await this.adRepository.findAll({ where });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.AdvertisingService = AdvertisingService;
//# sourceMappingURL=AdvertisingService.js.map