import { FindOptions, Op} from 'sequelize';
import { AdCampaign, AdCampaignAttributes, AdCampaignCreationAttributes, CampaignStatus, AdZone, PaymentStatus } from '@models/AdCampaign';
import { BaseRepository } from './BaseRepository';
import { AuditLogRepository } from './AuditLogRepository';
import  logger  from '@utils/logger';
import { tracer } from '@utils/tracer';
import sequelize from 'sequelize/types/sequelize';
import { AdCampaignWithAdvertiser } from 'src/types/adCampaign';

export interface AdCampaignFilterOptions {
  status?: CampaignStatus;
  advertiserId?: string;
  zone?: AdZone;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export class AdCampaignRepository extends BaseRepository<AdCampaign> {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    super(AdCampaign);
    this.auditLogRepository = new AuditLogRepository();
  }
  public async findActive(zone: string): Promise<AdCampaign[]> {
    return this.model.findAll({
      where: {
        status: 'ACTIVE',
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() }
      }
    });
  }

  public async incrementImpressions(id: string): Promise<void> {
    await this.model.increment('viewsDelivered', { where: { id } });
  }

  public async incrementClicks(id: string): Promise<void> {
    await this.model.increment('cpv', { where: { id } });
  }

  public async sumActiveBudgets(): Promise<number> {
    return await this.model.sum('budget', { where: { status: { [Op.ne]: 'DRAFT' } } });
  }

  async createWithAudit(data: AdCampaignCreationAttributes, auditData: any): Promise<AdCampaign> {
    return tracer.startActiveSpan('repository.AdCampaign.createWithAudit', async (span) => {
      const transaction = await AdCampaign.sequelize!.transaction();
      
      try {
        span.setAttribute('name', data.name);
        span.setAttribute('advertiserId', data.advertiserId);
        
        const campaign = await this.create(data, { transaction });
        
        // Create audit log
        await this.auditLogRepository.create({
          userId: auditData.userId,
          userEmail: auditData.userEmail,
          userType: auditData.userType,
          action: 'create',
          entityType: 'campaign',
          entityId: campaign.id,
          entityName: campaign.name,
          newValue: campaign.toJSON(),
          changes: Object.keys(data).map(key => ({
            field: key,
            newValue: data[key as keyof AdCampaignCreationAttributes]
          })),
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`Ad campaign created with audit: ${campaign.id}`);
        return campaign;
      } catch (error) {
        await transaction.rollback();
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating ad campaign with audit', { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateWithAudit(id: string, data: Partial<AdCampaignAttributes>, auditData: any): Promise<AdCampaign | null> {
    return tracer.startActiveSpan('repository.AdCampaign.updateWithAudit', async (span) => {
      const transaction = await AdCampaign.sequelize!.transaction();
      
      try {
        span.setAttribute('id', id);
        
        const campaign = await this.findById(id, { transaction });
        if (!campaign) {
          throw new Error('Campaign not found');
        }

        const oldValue = campaign.toJSON();
        
        // Update campaign
        await campaign.update(data, { transaction });
        
        // Get changes
        const changes = (Object.keys(data) as Array<keyof AdCampaignAttributes>)
          .filter(key => campaign.get(key) !== oldValue[key])
          .map(key => ({
            field: key,
            oldValue: oldValue[key],
            newValue: data[key as keyof AdCampaignAttributes]
          }));

        // Create audit log
        await this.auditLogRepository.create({
          userId: auditData.userId,
          userEmail: auditData.userEmail,
          userType: auditData.userType,
          action: 'update',
          entityType: 'campaign',
          entityId: id,
          entityName: campaign.name,
          oldValue,
          newValue: campaign.toJSON(),
          changes,
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`Ad campaign updated with audit: ${id}`);
        return campaign;
      } catch (error) {
        await transaction.rollback();
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error updating ad campaign with audit: ${id}`, { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findByAdvertiser(advertiserId: string, filters: AdCampaignFilterOptions = {}, pagination?: { page: number; limit: number }): Promise<{ data: AdCampaign[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.AdCampaign.findByAdvertiser', async (span) => {
      try {
        span.setAttribute('advertiserId', advertiserId);
        span.setAttribute('filters', JSON.stringify(filters));

        const where: any = { advertiserId };
        
        // Apply filters
        if (filters.status) {
          where.status = filters.status;
        }
        
        if (filters.zone) {
          where.zone = filters.zone;
        }
        
        if (filters.dateFrom || filters.dateTo) {
          const dateField = filters.status === CampaignStatus.ACTIVE ? 'startDate' : 'createdAt';
          where[dateField] = {};
          if (filters.dateFrom) {
            where[dateField][Op.gte] = filters.dateFrom;
          }
          if (filters.dateTo) {
            where[dateField][Op.lte] = filters.dateTo;
          }
        }
        
        if (filters.search) {
          where[Op.or] = [
            { name: { [Op.like]: `%${filters.search}%` } },
            { paymentReference: { [Op.like]: `%${filters.search}%` } }
          ];
        }

        const options: FindOptions = {
          where,
          order: [['createdAt', 'DESC']]
        };

        if (pagination) {
          return await this.paginate(pagination.page, pagination.limit, options);
        } else {
          const data = await this.findAll(options);
          const total = await this.count({ where });
          return {
            data,
            total,
            page: 1,
            totalPages: 1
          };
        }
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error finding ad campaigns by advertiser', { error, advertiserId, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findByStatus(status: CampaignStatus, pagination?: { page: number; limit: number }): Promise<{ data: AdCampaign[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.AdCampaign.findByStatus', async (span) => {
      try {
        span.setAttribute('status', status);
        
        const options: FindOptions = {
          where: { status },
          order: [['updatedAt', 'DESC']],
          include: ['advertiser']
        };

        if (pagination) {
          return await this.paginate(pagination.page, pagination.limit, options);
        } else {
          const data = await this.findAll(options);
          const total = await this.count({ where: { status } });
          return {
            data,
            total,
            page: 1,
            totalPages: 1
          };
        }
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error finding ad campaigns by status', { error, status });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paymentReference: string, auditData: any): Promise<AdCampaign | null> {
    return tracer.startActiveSpan('repository.AdCampaign.updatePaymentStatus', async (span) => {
      try {
        span.setAttribute('id', id);
        span.setAttribute('paymentStatus', paymentStatus);
        span.setAttribute('paymentReference', paymentReference);
        
        const updateData: Partial<AdCampaignAttributes> = {
          paymentStatus,
          paymentReference,
          status: paymentStatus === PaymentStatus.PAID ? CampaignStatus.ACTIVE : CampaignStatus.DRAFT
        };

        return await this.updateWithAudit(id, updateData, auditData);
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error updating ad campaign payment status: ${id}`, { error, paymentStatus, paymentReference });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async pauseCampaign(id: string, auditData: any): Promise<AdCampaign | null> {
    return tracer.startActiveSpan('repository.AdCampaign.pauseCampaign', async (span) => {
      try {
        span.setAttribute('id', id);
        
        return await this.updateWithAudit(
          id,
          { status: CampaignStatus.PAUSED },
          auditData
        );
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error pausing ad campaign: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async resumeCampaign(id: string, auditData: any): Promise<AdCampaign | null> {
    return tracer.startActiveSpan('repository.AdCampaign.resumeCampaign', async (span) => {
      try {
        span.setAttribute('id', id);
        
        return await this.updateWithAudit(
          id,
          { status: CampaignStatus.ACTIVE },
          auditData
        );
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error resuming ad campaign: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async incrementViews(id: string, uniqueViews: number = 0): Promise<void> {
    return tracer.startActiveSpan('repository.AdCampaign.incrementViews', async (span) => {
      const transaction = await AdCampaign.sequelize!.transaction();
      
      try {
        span.setAttribute('id', id);
        span.setAttribute('uniqueViews', uniqueViews);
        
        const campaign = await this.findById(id, { transaction });
        if (!campaign) {
          throw new Error('Campaign not found');
        }

        const updates: any = {
          viewsDelivered: this.model.sequelize!.literal('viewsDelivered + 1'),
          spent: this.model.sequelize!.literal(`spent + ${campaign.cpv}`)
        };

        if (uniqueViews > 0) {
          updates.uniqueViews = this.model.sequelize!.literal(`uniqueViews + ${uniqueViews}`);
        }

        // Check if campaign has reached its target
        if (campaign.spent ===campaign.budget) {
          updates.status = CampaignStatus.COMPLETED;
        }

        await campaign.update(updates, { transaction });

        await transaction.commit();
        logger.debug(`Ad campaign views incremented: ${id}`);
      } catch (error) {
        await transaction.rollback();
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error incrementing ad campaign views: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getPerformanceMetrics(id: string, startDate?: Date, endDate?: Date): Promise<{
    campaignId: string;

    viewsDelivered: number;

    uniqueViews: number;
    totalImpressions: number;
    clickThroughRate: number;
    cpv: number;
    totalSpent: number;
    remainingBudget: number;
    deliveryRate: number;
    estimatedCompletion?: Date;
  }> {
    return tracer.startActiveSpan('repository.AdCampaign.getPerformanceMetrics', async (span) => {
      try {
        span.setAttribute('id', id);
        if (startDate) span.setAttribute('startDate', startDate.toISOString());
        if (endDate) span.setAttribute('endDate', endDate.toISOString());
        
        const campaign = await this.findById(id);
        if (!campaign) {
          throw new Error('Campaign not found');
        }

    
        const remainingBudget = campaign.budget - campaign.spent;
        const deliveryRate = campaign.viewsDelivered / Math.max(1, this.daysBetween(campaign.startDate || campaign.createdAt, new Date()));
       
     

        const metrics = {
          campaignId: campaign.id,
         
          viewsDelivered: campaign.viewsDelivered,
    
          uniqueViews: campaign.uniqueViews,
          totalImpressions: campaign.viewsDelivered * 1.5, // Estimated impressions (1.5x views)
          clickThroughRate: campaign.uniqueViews > 0 ? (campaign.uniqueViews / campaign.viewsDelivered) * 100 : 0,
          cpv: campaign.cpv,
          totalSpent: campaign.spent,
          remainingBudget,
          deliveryRate,
         
        };

        span.setAttributes({
          viewsDelivered: metrics.viewsDelivered,
          uniqueViews: metrics.uniqueViews,
          totalSpent: metrics.totalSpent
        });

        return metrics;
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error getting ad campaign performance metrics: ${id}`, { error, startDate, endDate });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getCampaignsForAdPlacement(zone: AdZone, tags?: string[]): Promise<AdCampaign[]> {
    return tracer.startActiveSpan('repository.AdCampaign.getCampaignsForAdPlacement', async (span) => {
      try {
        span.setAttribute('zone', zone);
        if (tags) span.setAttribute('tags', JSON.stringify(tags));
        
        const now = new Date();
     const whereConditions: any = {
  zone,
  status: CampaignStatus.ACTIVE,
  paymentStatus: PaymentStatus.PAID,
  [Op.and]: []
};

// Add start date conditions
whereConditions[Op.and].push({
  [Op.or]: [
    { startDate: { [Op.lte]: now } },
    { startDate: null }
  ]
});

// Add end date conditions
whereConditions[Op.and].push({
  [Op.or]: [
    { endDate: { [Op.gte]: now } },
    { endDate: null }
  ]
});

const campaigns = await this.findAll({
  where: whereConditions,
  order: [
    [this.model.sequelize!.literal(`CASE WHEN targeting->'$.tags' IS NOT NULL THEN 1 ELSE 2 END`), 'ASC'],
    ['createdAt', 'DESC']
  ]
});

        // Filter by tags if provided
        const filteredCampaigns = tags ? 
          campaigns.filter(campaign => {
            const campaignTags = campaign.targeting || [];
            return campaignTags.length === 0 || campaignTags.some((tag: string) => tags.includes(tag));
          }) :
          campaigns;

        // Filter out campaigns that have reached their view limit
        const availableCampaigns = filteredCampaigns.filter(campaign => 
          campaign.spent < campaign.budget
        );

        span.setAttribute('total', campaigns.length);
        span.setAttribute('filtered', filteredCampaigns.length);
        span.setAttribute('available', availableCampaigns.length);
        
        return availableCampaigns;
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting campaigns for ad placement', { error, zone, tags });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async checkAndPauseCompletedCampaigns(): Promise<number> {
    return tracer.startActiveSpan('repository.AdCampaign.checkAndPauseCompletedCampaigns', async (span) => {
      try {
        const completedCampaigns = await this.findAll({
          where: {
            status: CampaignStatus.ACTIVE,
            viewsDelivered: { [Op.gte]: this.model.sequelize!.col('viewsPurchased') }
          }
        });

        for (const campaign of completedCampaigns) {
          await campaign.update({
            status: CampaignStatus.COMPLETED
          });
          logger.info(`Ad campaign auto-paused (completed): ${campaign.id}`);
        }

        span.setAttribute('paused', completedCampaigns.length);
        return completedCampaigns.length;
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error checking and pausing completed campaigns', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getAdvertisingAnalytics(dateFrom: Date, dateTo: Date): Promise<{
    totalRevenue: number;
    activeCampaigns: number;
    completedCampaigns: number;
    totalViewsDelivered: number;
    totalUniqueViews: number;
    averageCPV: number;
    topPerformingZones: any[];
    revenueByDay: any[];
  }> {
    return tracer.startActiveSpan('repository.AdCampaign.getAdvertisingAnalytics', async (span) => {
      try {
        span.setAttributes({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString()
        });

        const where = {
          createdAt: { [Op.between]: [dateFrom, dateTo] }
        };

        const [
          campaigns,
          revenueResult,
          viewsResult,
          uniqueViewsResult,
          byZone
        ] = await Promise.all([
          this.findAll({ where }),
          this.model.sum('spent', { where }),
          this.model.sum('viewsDelivered', { where }),
          this.model.sum('uniqueViews', { where }),
          this.model.findAll({
            attributes: [
              'zone',
              [this.model.sequelize!.fn('SUM', this.model.sequelize!.col('spent')), 'revenue'],
              [this.model.sequelize!.fn('SUM', this.model.sequelize!.col('viewsDelivered')), 'viewsDelivered'],
              [this.model.sequelize!.fn('AVG', this.model.sequelize!.col('cpv')), 'averageCPV']
            ],
            where,
            group: ['zone']
          })
        ]);

        const totalRevenue = revenueResult || 0;
        const totalViewsDelivered = viewsResult || 0;
        const totalUniqueViews = uniqueViewsResult || 0;
        const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length;
        const completedCampaigns = campaigns.filter(c => c.status === CampaignStatus.COMPLETED).length;
        const averageCPV = campaigns.length > 0 ? totalRevenue / totalViewsDelivered : 0;

        const topPerformingZones = (byZone as any[]).map(item => ({
          zone: item.zone,
          revenue: parseFloat(item.get('revenue')) || 0,
          viewsDelivered: parseInt(item.get('viewsDelivered')) || 0,
          averageCPV: parseFloat(item.get('averageCPV')) || 0,
          fillRate: Math.min(100, (parseInt(item.get('viewsDelivered')) || 0) / 10000 * 100) // Example calculation
        }));

        // Generate revenue by day data
        const revenueByDay = this.generateRevenueByDay(dateFrom, dateTo, campaigns);

        const analytics = {
          totalRevenue,
          activeCampaigns,
          completedCampaigns,
          totalViewsDelivered,
          totalUniqueViews,
          averageCPV,
          topPerformingZones,
          revenueByDay
        };

        span.setAttribute('totalRevenue', analytics.totalRevenue);
        span.setAttribute('activeCampaigns', analytics.activeCampaigns);
        
        return analytics;
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting advertising analytics', { error, dateFrom, dateTo });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  private generateRevenueByDay(dateFrom: Date, dateTo: Date, campaigns: AdCampaign[]): any[] {
    const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    const revenueByDay = [];
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(dateFrom);
      date.setDate(date.getDate() + i);
      
      // Calculate revenue for this day
      const dayRevenue = campaigns
        .filter(campaign => {
          const campaignDate = campaign.createdAt;
          return campaignDate.getDate() === date.getDate() &&
                 campaignDate.getMonth() === date.getMonth() &&
                 campaignDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, campaign) => sum + campaign.spent, 0);
      
      revenueByDay.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        campaigns: campaigns.filter(campaign => {
          const campaignDate = campaign.createdAt;
          return campaignDate.getDate() === date.getDate() &&
                 campaignDate.getMonth() === date.getMonth() &&
                 campaignDate.getFullYear() === date.getFullYear();
        }).length
      });
    }
    
    return revenueByDay;
  }

  private daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async exportCampaignData(id: string, format: 'csv' | 'json' = 'csv'): Promise<any> {
    return tracer.startActiveSpan('repository.AdCampaign.exportCampaignData', async (span) => {
      try {
        span.setAttributes({
          id,
          format
        });

        const campaign = await this.findById(id, {
          include: ['advertiser'],
          raw: true,
          nest: true
        }) as AdCampaignWithAdvertiser;

        if (!campaign) {
          throw new Error('Campaign not found');
        }

        // Transform for export
        const exportData = {
          id: campaign.id,
          name: campaign.name,
          advertiser: campaign.advertiser?.contactEmail,
    
          status: campaign.status,
          budget: campaign.budget,
          spent: campaign.spent,
   
          viewsDelivered: campaign.viewsDelivered,
          uniqueViews: campaign.uniqueViews,
          cpv: campaign.cpv,
          paymentStatus: campaign.paymentStatus,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt
        };

        return exportData;
      } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error exporting campaign data: ${id}`, { error, format });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}