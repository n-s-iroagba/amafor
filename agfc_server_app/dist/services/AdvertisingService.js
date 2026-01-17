"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisingService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
class AdvertisingService {
    constructor() {
        this.adRepository = new repositories_1.AdCampaignRepository();
    }
    async createCampaign(data, advertiserId) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.createCampaign', async (span) => {
            try {
                // Calculate cost based on duration/impressions (Business Logic)
                // For MVP, we assume amount is passed or calculated elsewhere before service call
                const campaign = await this.adRepository.create({
                    ...data,
                    advertiserId,
                    status: 'PENDING_PAYMENT',
                    currentImpressions: 0,
                    currentClicks: 0
                });
                utils_1.structuredLogger.business('AD_CAMPAIGN_CREATED', data.budget || 0, advertiserId, {
                    campaignId: campaign.id,
                    zone: data.zone
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
    async activateCampaign(campaignId) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.activateCampaign', async (span) => {
            try {
                const [affected, updated] = await this.adRepository.update(campaignId, {
                    status: 'ACTIVE',
                    startDate: new Date()
                });
                if (!affected)
                    throw new Error('Campaign not found');
                utils_1.structuredLogger.business('AD_CAMPAIGN_ACTIVATED', 0, 'system', { campaignId });
                return updated[0];
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
    async getAdForZone(zone) {
        return utils_1.tracer.startActiveSpan('service.AdvertisingService.getAdForZone', async (span) => {
            try {
                // Find all active campaigns for this zone where current impressions < max impressions
                // This requires a custom repository method or complex query
                const campaigns = await this.adRepository.findActiveForZone(zone);
                if (!campaigns.length)
                    return null;
                // Simple Random Selection (Weighted logic can be added later)
                const selected = campaigns[Math.floor(Math.random() * campaigns.length)];
                // Async: Track impression immediately or queue it
                this.trackImpression(selected.id).catch(err => utils_1.structuredLogger.error('Failed to track impression', { error: err.message, campaignId: selected.id }));
                return selected;
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
    async trackImpression(campaignId) {
        await this.adRepository.incrementImpressions(campaignId);
    }
    async trackClick(campaignId) {
        await this.adRepository.incrementClicks(campaignId);
        utils_1.structuredLogger.business('AD_CLICKED', 0, 'public', { campaignId });
    }
}
exports.AdvertisingService = AdvertisingService;
//# sourceMappingURL=AdvertisingService.js.map