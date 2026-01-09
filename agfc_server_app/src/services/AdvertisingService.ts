import { AdCampaignRepository } from '../repositories';
import { AdCampaign, AdCampaignCreationAttributes } from '../models';
import { structuredLogger, tracer } from '../utils';
import { Op } from 'sequelize';

export class AdvertisingService {
  private adRepository: AdCampaignRepository;

  constructor() {
    this.adRepository = new AdCampaignRepository();
  }

  public async createCampaign(data: AdCampaignCreationAttributes, advertiserId: string): Promise<AdCampaign> {
    return tracer.startActiveSpan('service.AdvertisingService.createCampaign', async (span) => {
      try {
        // Calculate cost based on duration/impressions (Business Logic)
        // For MVP, we assume amount is passed or calculated elsewhere before service call
        
        const campaign = await this.adRepository.create({
          ...data,
          advertiserId,
          status: 'PENDING_PAYMENT', // Default start state
          currentImpressions: 0,
          currentClicks: 0
        });

        structuredLogger.business('AD_CAMPAIGN_CREATED', data.budget || 0, advertiserId, { 
          campaignId: campaign.id, 
          zone: data.zone 
        });
        
        return campaign;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async activateCampaign(campaignId: string): Promise<AdCampaign> {
    return tracer.startActiveSpan('service.AdvertisingService.activateCampaign', async (span) => {
      try {
        const [affected, updated] = await this.adRepository.update(campaignId, {
          status: 'ACTIVE',
          startDate: new Date()
        });

        if (!affected) throw new Error('Campaign not found');

        structuredLogger.business('AD_CAMPAIGN_ACTIVATED', 0, 'system', { campaignId });
        return updated[0];
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async getAdForZone(zone: string): Promise<AdCampaign | null> {
    return tracer.startActiveSpan('service.AdvertisingService.getAdForZone', async (span) => {
      try {
        // Find all active campaigns for this zone where current impressions < max impressions
        // This requires a custom repository method or complex query
        const campaigns = await this.adRepository.findActiveForZone(zone);
        
        if (!campaigns.length) return null;

        // Simple Random Selection (Weighted logic can be added later)
        const selected = campaigns[Math.floor(Math.random() * campaigns.length)];
        
        // Async: Track impression immediately or queue it
        this.trackImpression(selected.id).catch(err => 
          structuredLogger.error('Failed to track impression', { error: err.message, campaignId: selected.id })
        );

        return selected;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async trackImpression(campaignId: string): Promise<void> {
    await this.adRepository.incrementImpressions(campaignId);
  }

  public async trackClick(campaignId: string): Promise<void> {
    await this.adRepository.incrementClicks(campaignId);
    structuredLogger.business('AD_CLICKED', 0, 'public', { campaignId });
  }
}