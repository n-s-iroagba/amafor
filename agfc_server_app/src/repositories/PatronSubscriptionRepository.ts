import { FindOptions, Op} from 'sequelize';
import { PatronSubscription, PatronSubscriptionAttributes, PatronSubscriptionCreationAttributes, PatronTier, SubscriptionFrequency, SubscriptionStatus } from '@models/PatronSubscription';
import { BaseRepository } from './BaseRepository';
import { AuditLogRepository } from './AuditLogRepository';
import  logger  from '@utils/logger';
import { tracer } from '@utils/tracer';
import { underscoredIf } from 'sequelize/types/utils';
import { PatronSubscriptionWithPatron } from 'src/types/patronSubscription';

export interface PatronFilterOptions {
  tier?: PatronTier;
  status?: SubscriptionStatus;
  frequency?: SubscriptionFrequency;
  search?: string;
}

export class PatronSubscriptionRepository extends BaseRepository<PatronSubscription> {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    super(PatronSubscription);
    this.auditLogRepository = new AuditLogRepository();
  }
public async deactivateCurrent(patronId: string): Promise<void> {
    await this.model.update(
      { status: SubscriptionStatus.CANCELLED,endDate: new Date() },
      { where: { patronId, status: 'ACTIVE' } }
    );
  }

  public async findActiveByPatrongId(patronId: string): Promise<PatronSubscription | null> {
    return this.model.findOne({
      where: { 
        patronId, 
        status: 'ACTIVE',
   
      }  
    });
  }
  async createWithAudit(data: PatronSubscriptionCreationAttributes, auditData: any): Promise<PatronSubscription> {
    return tracer.startActiveSpan('repository.PatronSubscription.createWithAudit', async (span) => {
      const transaction = await PatronSubscription.sequelize!.transaction();
      
      try {
        span.setAttribute('patronId', data.patronId);
        span.setAttribute('tier', data.tier);
        
        // Calculate next billing date
        const nextBillingDate = this.calculateNextBillingDate(data.frequency);
        const subscriptionData = {
          ...data,
          nextBillingDate,
          startedAt: new Date()
        };

        const subscription = await this.create(subscriptionData, { transaction });
        
        // Create audit log
        await this.auditLogRepository.create({
          patronId: auditData.patronId,
          userEmail: auditData.userEmail,
          userType: auditData.userType,
          action: 'create',
          entityType: 'patron',
          entityId: subscription.id,
          entityName: `Patron subscription for ${subscription.displayName}`,
          newValue: subscription.toJSON(),
          changes: Object.keys(data).map(key => ({
            field: key,
            newValue: data[key as keyof PatronSubscriptionCreationAttributes]
          })),
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`Patron subscription created with audit: ${subscription.id}`);
        return subscription;
      } catch (error) {
        await transaction.rollback();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating patron subscription with audit', { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateWithAudit(id: string, data: Partial<PatronSubscriptionAttributes>, auditData: any): Promise<PatronSubscription | null> {
    return tracer.startActiveSpan('repository.PatronSubscription.updateWithAudit', async (span) => {
      const transaction = await PatronSubscription.sequelize!.transaction();
      
      try {
        span.setAttribute('id', id);
        
        const subscription = await this.findById(id, { transaction });
        if (!subscription) {
          throw new Error('Patron subscription not found');
        }

        const oldValue = subscription.toJSON();
        
        // Update subscription
        await subscription.update(data, { transaction });
        
        // Get changes
        const changes = (Object.keys(data)as Array<keyof PatronSubscriptionAttributes>)
          .filter(key => subscription.get(key) !== oldValue[key])
          .map(key => ({
            field: key,
            oldValue: oldValue[key],
            newValue: data[key as keyof PatronSubscriptionAttributes]
          }));

        // Create audit log
        await this.auditLogRepository.create({
          patronId: auditData.patronId,
          userEmail: auditData.userEmail,
          userType: auditData.userType,
          action: 'update',
          entityType: 'patron',
          entityId: id,
          entityName: `Patron subscription for ${subscription.displayName}`,
          oldValue,
          newValue: subscription.toJSON(),
          changes,
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`Patron subscription updated with audit: ${id}`);
        return subscription;
      } catch (error) {
        await transaction.rollback();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error updating patron subscription with audit: ${id}`, { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async cancelSubscription(id: string, auditData: any): Promise<PatronSubscription | null> {
    return tracer.startActiveSpan('repository.PatronSubscription.cancelSubscription', async (span) => {
      try {
        span.setAttribute('id', id);
        
        return await this.updateWithAudit(
          id,
          {
            status: SubscriptionStatus.CANCELLED,
            cancelledAt: new Date(),
            nextBillingDate: undefined
          },
          auditData
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error cancelling patron subscription: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updatePaymentStatus(id: string, status: SubscriptionStatus, paymentReference: string, nextBillingDate?: Date): Promise<[number, PatronSubscription[]] | null> {
    return tracer.startActiveSpan('repository.PatronSubscription.updatePaymentStatus', async (span) => {
      try {
        span.setAttribute('id', id);
        span.setAttribute('status', status);
        span.setAttribute('paymentReference', paymentReference);
        if (nextBillingDate) span.setAttribute('nextBillingDate', nextBillingDate.toISOString());
        
        const updateData: Partial<PatronSubscriptionAttributes> = {
          status,
          paymentReference
        };

        if (nextBillingDate) {
          updateData.nextBillingDate = nextBillingDate;
        }

        // If payment failed and it's not the first failure, mark as expired
        const subscription = await this.findById(id);
        if (subscription && status === SubscriptionStatus.PAYMENT_FAILED && subscription.status === SubscriptionStatus.PAYMENT_FAILED) {
          updateData.status = SubscriptionStatus.EXPIRED;
        }

        return await this.update(id, updateData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error updating patron subscription payment status: ${id}`, { error, status, paymentReference });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findByPatron(patronId: string, filters: PatronFilterOptions = {}): Promise<PatronSubscription[]> {
    return tracer.startActiveSpan('repository.PatronSubscription.findByUser', async (span) => {
      try {
        span.setAttribute('patronId', patronId);
        span.setAttribute('filters', JSON.stringify(filters));

        const where: any = { patronId };
        
        // Apply filters
        if (filters.tier) {
          where.tier = filters.tier;
        }
        
        if (filters.status) {
          where.status = filters.status;
        }
        
        if (filters.frequency) {
          where.frequency = filters.frequency;
        }

        const subscriptions = await this.findAll({
          where,
          order: [['startedAt', 'DESC']]
        });

        span.setAttribute('count', subscriptions.length);
        return subscriptions;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error finding patron subscriptions by user', { error, patronId, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findActivePatrons(filters: PatronFilterOptions = {}, pagination?: { page: number; limit: number }): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.PatronSubscription.findActivePatrons', async (span) => {
      try {
        span.setAttribute('filters', JSON.stringify(filters));

        const where: any = { status: SubscriptionStatus.ACTIVE };
        
        // Apply filters
        if (filters.tier) {
          where.tier = filters.tier;
        }
        
        if (filters.frequency) {
          where.frequency = filters.frequency;
        }
        
        if (filters.search) {
          where[Op.or] = [
            { displayName: { [Op.like]: `%${filters.search}%` } },
            { message: { [Op.like]: `%${filters.search}%` } }
          ];
        }

        const options: FindOptions = {
          where,
          order: [
            ['tier', 'ASC'],
            ['displayName', 'ASC']
          ],
          include: ['user']
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
        logger.error('Error finding active patrons', { error, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getPublicPatronList(pagination?: { page: number; limit: number }): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.PatronSubscription.getPublicPatronList', async (span) => {
      try {
        const patrons = await this.findAll({
          where: { status: SubscriptionStatus.ACTIVE },
          order: [
            ['tier', 'ASC'],
            ['displayName', 'ASC']
          ],
          raw: true
        });

        // Transform for public display
        const patronData = patrons.map(patron => ({
          id: patron.id,
          name: patron.displayName,
          displayName: patron.displayName,
          tier: patron.tier,
          portraitUrl: patron.portraitUrl,
          logoUrl: patron.logoUrl,
          message: patron.message,
          joinedAt: patron.startedAt,
          isCorporate: !!patron.logoUrl
        }));

        // Handle pagination manually for transformed data
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedData = patronData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(patronData.length / limit);

        span.setAttributes({
          total: patronData.length,
          page,
          totalPages
        });

        return {
          data: paginatedData,
          total: patronData.length,
          page,
          totalPages
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting public patron list', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getPatronTierStats(): Promise<{
    tiers: any[];
    benefits: Record<string, string[]>;
  }> {
    return tracer.startActiveSpan('repository.PatronSubscription.getPatronTierStats', async (span) => {
      try {
        const tierStats = await this.model.findAll({
          attributes: [
            'tier',
            [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'currentPatrons'],
            [this.model.sequelize!.fn('SUM', this.model.sequelize!.col('amount')), 'totalRevenue']
          ],
          where: { status: SubscriptionStatus.ACTIVE },
          group: ['tier']
        });

        // Define tier configurations
        const tierConfigs: Record<string, any> = {
          [PatronTier.SPONSOR_GRAND_PATRON]: {
            name: 'Sponsor/Grand Patron',
            description: 'Top-tier sponsorship with maximum visibility',
            monthlyAmount: 50000,
            yearlyAmount: 550000,
            lifetimeAmount: 1000000,
            benefits: ['Premium logo placement', 'Exclusive events', 'Meet & greet with players', 'Social media recognition'],
            maxPatrons: 5
          },
          [PatronTier.PATRON]: {
            name: 'Patron',
            description: 'Dedicated support with premium benefits',
            monthlyAmount: 25000,
            yearlyAmount: 275000,
            lifetimeAmount: 500000,
            benefits: ['Name on patron wall', 'Season ticket', 'Club newsletter', 'Digital certificate'],
            maxPatrons: 20
          },
          [PatronTier.SUPPORTER]: {
            name: 'Supporter',
            description: 'Regular support with recognition',
            monthlyAmount: 10000,
            yearlyAmount: 110000,
            lifetimeAmount: 200000,
            benefits: ['Name on supporter wall', 'Monthly newsletter', 'Digital badge'],
            maxPatrons: 50
          },
          [PatronTier.ADVOCATE]: {
            name: 'Advocate',
            description: 'Entry-level support with basic benefits',
            monthlyAmount: 5000,
            yearlyAmount: 55000,
            lifetimeAmount: 100000,
            benefits: ['Name recognition', 'Newsletter'],
            maxPatrons: 100
          },
          [PatronTier.LEGEND]: {
            name: 'Legend',
            description: 'One-time significant contribution',
            monthlyAmount: 0,
            yearlyAmount: 0,
            lifetimeAmount: 50000,
            benefits: ['Permanent recognition', 'Digital certificate'],
            maxPatrons: null // Unlimited
          }
        };

        // Build tier data with current stats
        const tiers = Object.entries(tierConfigs).map(([tierId, config]) => {
          const stat = (tierStats as any[]).find(s => s.tier === tierId);
          return {
            id: tierId,
            name: config.name,
            description: config.description,
            monthlyAmount: config.monthlyAmount,
            yearlyAmount: config.yearlyAmount,
            lifetimeAmount: config.lifetimeAmount,
            benefits: config.benefits,
            maxPatrons: config.maxPatrons,
            currentPatrons: stat ? parseInt(stat.get('currentPatrons')) : 0
          };
        });

        // Extract benefits
        const benefits: Record<string, string[]> = {};
        Object.entries(tierConfigs).forEach(([tierId, config]) => {
          benefits[tierId] = config.benefits;
        });

        span.setAttribute('tierCount', tiers.length);
        return { tiers, benefits };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting patron tier stats', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async processSubscriptionRenewals(): Promise<{ renewed: number; failed: number }> {
    return tracer.startActiveSpan('repository.PatronSubscription.processSubscriptionRenewals', async (span) => {
      const transaction = await PatronSubscription.sequelize!.transaction();
      
      try {
        const now = new Date();
        const renewals = await this.findAll({
          where: {
            status: SubscriptionStatus.ACTIVE,
            nextBillingDate: { [Op.lte]: now },
            frequency: { [Op.in]: [SubscriptionFrequency.MONTHLY, SubscriptionFrequency.YEARLY] }
          },
          transaction
        });

        let renewed = 0;
        let failed = 0;

        for (const subscription of renewals) {
          try {
            // Calculate next billing date
            const nextBillingDate = this.calculateNextBillingDate(subscription.frequency, subscription.nextBillingDate || subscription.startedAt);
            
            await subscription.update(
              {
                nextBillingDate,
                paymentReference: `RENEW_${Date.now()}_${subscription.id}`
              },
              { transaction }
            );

            renewed++;
            logger.info(`Patron subscription renewed: ${subscription.id}`);
          } catch (error) {
            // Mark as payment failed
            await subscription.update(
              {
                status: SubscriptionStatus.PAYMENT_FAILED
              },
              { transaction }
            );

            failed++;
            logger.error(`Patron subscription renewal failed: ${subscription.id}`, { error });
          }
        }

        await transaction.commit();
        
        span.setAttributes({
          renewed,
          failed
        });

        logger.info(`Processed ${renewed} subscription renewals, ${failed} failed`);
        return { renewed, failed };
      } catch (error) {
        await transaction.rollback();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error processing subscription renewals', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  private calculateNextBillingDate(frequency: SubscriptionFrequency, fromDate?: Date): Date | undefined {
    const baseDate = fromDate || new Date();
    const nextDate = new Date(baseDate);

    switch (frequency) {
      case SubscriptionFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        return nextDate;
      case SubscriptionFrequency.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        return nextDate;
      case SubscriptionFrequency.LIFETIME:
        return undefined; // No renewals for lifetime
      default:
        return undefined;
    }
  }

  async getPatronAnalytics(dateFrom: Date, dateTo: Date): Promise<{
    totalPatrons: number;
    activePatrons: number;
    newPatrons: number;
    churnedPatrons: number;
    totalRevenue: number;
    byTier: Record<string, number>;
    byFrequency: Record<string, number>;
  }> {
    return tracer.startActiveSpan('repository.PatronSubscription.getPatronAnalytics', async (span) => {
      try {
        span.setAttributes({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString()
        });

        const [
          totalPatrons,
          activePatrons,
          newPatrons,
          churnedPatrons,
          totalRevenue,
          byTier,
          byFrequency
        ] = await Promise.all([
          this.count(),
          this.count({ where: { status: SubscriptionStatus.ACTIVE } }),
          this.count({
            where: {
              startedAt: { [Op.between]: [dateFrom, dateTo] }
            }
          }),
          this.count({
            where: {
              status: SubscriptionStatus.CANCELLED,
              cancelledAt: { [Op.between]: [dateFrom, dateTo] }
            }
          }),
          this.model.sum('amount', {
            where: {
              startedAt: { [Op.between]: [dateFrom, dateTo] }
            }
          }),
          this.model.findAll({
            attributes: [
              'tier',
              [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count'],
              [this.model.sequelize!.fn('SUM', this.model.sequelize!.col('amount')), 'revenue']
            ],
            where: {
              startedAt: { [Op.between]: [dateFrom, dateTo] }
            },
            group: ['tier']
          }),
          this.model.findAll({
            attributes: [
              'frequency',
              [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count'],
              [this.model.sequelize!.fn('SUM', this.model.sequelize!.col('amount')), 'revenue']
            ],
            where: {
              startedAt: { [Op.between]: [dateFrom, dateTo] }
            },
            group: ['frequency']
          })
        ]);

        const byTierMap = (byTier as any[]).reduce((acc, item) => {
          acc[item.tier] = {
            count: parseInt(item.get('count')),
            revenue: parseFloat(item.get('revenue')) || 0
          };
          return acc;
        }, {});

        const byFrequencyMap = (byFrequency as any[]).reduce((acc, item) => {
          acc[item.frequency] = {
            count: parseInt(item.get('count')),
            revenue: parseFloat(item.get('revenue')) || 0
          };
          return acc;
        }, {});

        const analytics = {
          totalPatrons,
          activePatrons,
          newPatrons,
          churnedPatrons,
          totalRevenue: totalRevenue || 0,
          byTier: byTierMap,
          byFrequency: byFrequencyMap
        };

        span.setAttributes({
          totalPatrons: analytics.totalPatrons,
          activePatrons: analytics.activePatrons,
          totalRevenue: analytics.totalRevenue
        });

        return analytics;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting patron analytics', { error, dateFrom, dateTo });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async exportPatronData(format: 'csv' | 'json' = 'csv'): Promise<any[]> {
    return tracer.startActiveSpan('repository.PatronSubscription.exportPatronData', async (span) => {
      try {
        span.setAttribute('format', format);
        
        const subscriptions = await this.findAll({
          include: ['patron'],
          raw: true,
          nest: true
        })as PatronSubscriptionWithPatron[];

        // Transform for export
        const exportData = subscriptions.map(subscription => ({
          id: subscription.id,
          name: subscription.displayName,
          email: subscription.patron.email,
          tier: subscription.tier,
          frequency: subscription.frequency,
          amount: subscription.amount,
          status: subscription.status,
          startedAt: subscription.startedAt,
          nextBillingDate: subscription.nextBillingDate,
          cancelledAt: subscription.cancelledAt,
          paymentMethod: subscription.paymentMethod,
          totalPaid: subscription.amount * this.calculateMonthsActive(subscription.startedAt, subscription.frequency)
        }));

        span.setAttribute('count', exportData.length);
        return exportData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error exporting patron data', { error, format });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  private calculateMonthsActive(startedAt: Date, frequency: SubscriptionFrequency): number {
    const now = new Date();
    const diffMonths = (now.getFullYear() - startedAt.getFullYear()) * 12 + (now.getMonth() - startedAt.getMonth());
    
    switch (frequency) {
      case SubscriptionFrequency.MONTHLY:
        return diffMonths;
      case SubscriptionFrequency.YEARLY:
        return Math.floor(diffMonths / 12);
      case SubscriptionFrequency.LIFETIME:
        return 1; // One-time payment
      default:
        return 0;
    }
  }
}