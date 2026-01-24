"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronSubscriptionRepository = void 0;
const sequelize_1 = require("sequelize");
const PatronSubscription_1 = require("@models/PatronSubscription");
const BaseRepository_1 = require("./BaseRepository");
const AuditLogRepository_1 = require("./AuditLogRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
class PatronSubscriptionRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(PatronSubscription_1.PatronSubscription);
        this.auditLogRepository = new AuditLogRepository_1.AuditLogRepository();
    }
    async deactivateCurrent(patronId) {
        await this.model.update({ status: PatronSubscription_1.SubscriptionStatus.CANCELLED, endDate: new Date() }, { where: { patronId, status: 'ACTIVE' } });
    }
    async findActiveByPatronId(patronId) {
        return this.model.findOne({
            where: {
                patronId,
                status: 'ACTIVE',
            }
        });
    }
    async createWithAudit(data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.createWithAudit', async (span) => {
            const transaction = await PatronSubscription_1.PatronSubscription.sequelize.transaction();
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
                        newValue: data[key]
                    })),
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Patron subscription created with audit: ${subscription.id}`);
                return subscription;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating patron subscription with audit', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateWithAudit(id, data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.updateWithAudit', async (span) => {
            const transaction = await PatronSubscription_1.PatronSubscription.sequelize.transaction();
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
                const changes = Object.keys(data)
                    .filter(key => subscription.get(key) !== oldValue[key])
                    .map(key => ({
                    field: key,
                    oldValue: oldValue[key],
                    newValue: data[key]
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
                logger_1.default.info(`Patron subscription updated with audit: ${id}`);
                return subscription;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating patron subscription with audit: ${id}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async sumCompletedAmounts() {
        const result = await this.model.sum('amount', {
            where: {
                status: { [sequelize_1.Op.or]: [PatronSubscription_1.SubscriptionStatus.ACTIVE, PatronSubscription_1.SubscriptionStatus.EXPIRED] } // Count active and expired subscriptions
            }
        });
        return result || 0;
    }
    async cancelSubscription(id, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.cancelSubscription', async (span) => {
            try {
                span.setAttribute('id', id);
                return await this.updateWithAudit(id, {
                    status: PatronSubscription_1.SubscriptionStatus.CANCELLED,
                    cancelledAt: new Date(),
                    nextBillingDate: undefined
                }, auditData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error cancelling patron subscription: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updatePaymentStatus(id, status, paymentReference, nextBillingDate) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.updatePaymentStatus', async (span) => {
            try {
                span.setAttribute('id', id);
                span.setAttribute('status', status);
                span.setAttribute('paymentReference', paymentReference);
                if (nextBillingDate)
                    span.setAttribute('nextBillingDate', nextBillingDate.toISOString());
                const updateData = {
                    status,
                    paymentReference
                };
                if (nextBillingDate) {
                    updateData.nextBillingDate = nextBillingDate;
                }
                // If payment failed and it's not the first failure, mark as expired
                const subscription = await this.findById(id);
                if (subscription && status === PatronSubscription_1.SubscriptionStatus.PAYMENT_FAILED && subscription.status === PatronSubscription_1.SubscriptionStatus.PAYMENT_FAILED) {
                    updateData.status = PatronSubscription_1.SubscriptionStatus.EXPIRED;
                }
                return await this.update(id, updateData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating patron subscription payment status: ${id}`, { error, status, paymentReference });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findByPatron(patronId, filters = {}) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.findByUser', async (span) => {
            try {
                span.setAttribute('patronId', patronId);
                span.setAttribute('filters', JSON.stringify(filters));
                const where = { patronId };
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding patron subscriptions by user', { error, patronId, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findActivePatrons(filters = {}, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.findActivePatrons', async (span) => {
            try {
                span.setAttribute('filters', JSON.stringify(filters));
                const where = { status: PatronSubscription_1.SubscriptionStatus.ACTIVE };
                // Apply filters
                if (filters.tier) {
                    where.tier = filters.tier;
                }
                if (filters.frequency) {
                    where.frequency = filters.frequency;
                }
                if (filters.search) {
                    where[sequelize_1.Op.or] = [
                        { displayName: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { message: { [sequelize_1.Op.like]: `%${filters.search}%` } }
                    ];
                }
                const options = {
                    where,
                    order: [
                        ['tier', 'ASC'],
                        ['displayName', 'ASC']
                    ],
                    include: ['user']
                };
                if (pagination) {
                    return await this.paginate(pagination.page, pagination.limit, options);
                }
                else {
                    const data = await this.findAll(options);
                    const total = await this.count({ where });
                    return {
                        data,
                        total,
                        page: 1,
                        totalPages: 1
                    };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding active patrons', { error, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getPublicPatronList(pagination) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.getPublicPatronList', async (span) => {
            try {
                const patrons = await this.findAll({
                    where: { status: PatronSubscription_1.SubscriptionStatus.ACTIVE },
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting public patron list', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getPatronTierStats() {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.getPatronTierStats', async (span) => {
            try {
                const tierStats = await this.model.findAll({
                    attributes: [
                        'tier',
                        [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'currentPatrons'],
                        [this.model.sequelize.fn('SUM', this.model.sequelize.col('amount')), 'totalRevenue']
                    ],
                    where: { status: PatronSubscription_1.SubscriptionStatus.ACTIVE },
                    group: ['tier']
                });
                // Define tier configurations
                const tierConfigs = {
                    [PatronSubscription_1.PatronTier.SPONSOR_GRAND_PATRON]: {
                        name: 'Sponsor/Grand Patron',
                        description: 'Top-tier sponsorship with maximum visibility',
                        monthlyAmount: 50000,
                        yearlyAmount: 550000,
                        lifetimeAmount: 1000000,
                        benefits: ['Premium logo placement', 'Exclusive events', 'Meet & greet with players', 'Social media recognition'],
                        maxPatrons: 5
                    },
                    [PatronSubscription_1.PatronTier.PATRON]: {
                        name: 'Patron',
                        description: 'Dedicated support with premium benefits',
                        monthlyAmount: 25000,
                        yearlyAmount: 275000,
                        lifetimeAmount: 500000,
                        benefits: ['Name on patron wall', 'Season ticket', 'Club newsletter', 'Digital certificate'],
                        maxPatrons: 20
                    },
                    [PatronSubscription_1.PatronTier.SUPPORTER]: {
                        name: 'Supporter',
                        description: 'Regular support with recognition',
                        monthlyAmount: 10000,
                        yearlyAmount: 110000,
                        lifetimeAmount: 200000,
                        benefits: ['Name on supporter wall', 'Monthly newsletter', 'Digital badge'],
                        maxPatrons: 50
                    },
                    [PatronSubscription_1.PatronTier.ADVOCATE]: {
                        name: 'Advocate',
                        description: 'Entry-level support with basic benefits',
                        monthlyAmount: 5000,
                        yearlyAmount: 55000,
                        lifetimeAmount: 100000,
                        benefits: ['Name recognition', 'Newsletter'],
                        maxPatrons: 100
                    },
                    [PatronSubscription_1.PatronTier.LEGEND]: {
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
                    const stat = tierStats.find(s => s.tier === tierId);
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
                const benefits = {};
                Object.entries(tierConfigs).forEach(([tierId, config]) => {
                    benefits[tierId] = config.benefits;
                });
                span.setAttribute('tierCount', tiers.length);
                return { tiers, benefits };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting patron tier stats', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async processSubscriptionRenewals() {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.processSubscriptionRenewals', async (span) => {
            const transaction = await PatronSubscription_1.PatronSubscription.sequelize.transaction();
            try {
                const now = new Date();
                const renewals = await this.findAll({
                    where: {
                        status: PatronSubscription_1.SubscriptionStatus.ACTIVE,
                        nextBillingDate: { [sequelize_1.Op.lte]: now },
                        frequency: { [sequelize_1.Op.in]: [PatronSubscription_1.SubscriptionFrequency.MONTHLY, PatronSubscription_1.SubscriptionFrequency.YEARLY] }
                    },
                    transaction
                });
                let renewed = 0;
                let failed = 0;
                for (const subscription of renewals) {
                    try {
                        // Calculate next billing date
                        const nextBillingDate = this.calculateNextBillingDate(subscription.frequency, subscription.nextBillingDate || subscription.startedAt);
                        await subscription.update({
                            nextBillingDate,
                            paymentReference: `RENEW_${Date.now()}_${subscription.id}`
                        }, { transaction });
                        renewed++;
                        logger_1.default.info(`Patron subscription renewed: ${subscription.id}`);
                    }
                    catch (error) {
                        // Mark as payment failed
                        await subscription.update({
                            status: PatronSubscription_1.SubscriptionStatus.PAYMENT_FAILED
                        }, { transaction });
                        failed++;
                        logger_1.default.error(`Patron subscription renewal failed: ${subscription.id}`, { error });
                    }
                }
                await transaction.commit();
                span.setAttributes({
                    renewed,
                    failed
                });
                logger_1.default.info(`Processed ${renewed} subscription renewals, ${failed} failed`);
                return { renewed, failed };
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error processing subscription renewals', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    calculateNextBillingDate(frequency, fromDate) {
        const baseDate = fromDate || new Date();
        const nextDate = new Date(baseDate);
        switch (frequency) {
            case PatronSubscription_1.SubscriptionFrequency.MONTHLY:
                nextDate.setMonth(nextDate.getMonth() + 1);
                return nextDate;
            case PatronSubscription_1.SubscriptionFrequency.YEARLY:
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                return nextDate;
            case PatronSubscription_1.SubscriptionFrequency.LIFETIME:
                return undefined; // No renewals for lifetime
            default:
                return undefined;
        }
    }
    async getPatronAnalytics(dateFrom, dateTo) {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.getPatronAnalytics', async (span) => {
            try {
                span.setAttributes({
                    dateFrom: dateFrom.toISOString(),
                    dateTo: dateTo.toISOString()
                });
                const [totalPatrons, activePatrons, newPatrons, churnedPatrons, totalRevenue, byTier, byFrequency] = await Promise.all([
                    this.count(),
                    this.count({ where: { status: PatronSubscription_1.SubscriptionStatus.ACTIVE } }),
                    this.count({
                        where: {
                            startedAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                        }
                    }),
                    this.count({
                        where: {
                            status: PatronSubscription_1.SubscriptionStatus.CANCELLED,
                            cancelledAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                        }
                    }),
                    this.model.sum('amount', {
                        where: {
                            startedAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                        }
                    }),
                    this.model.findAll({
                        attributes: [
                            'tier',
                            [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count'],
                            [this.model.sequelize.fn('SUM', this.model.sequelize.col('amount')), 'revenue']
                        ],
                        where: {
                            startedAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                        },
                        group: ['tier']
                    }),
                    this.model.findAll({
                        attributes: [
                            'frequency',
                            [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count'],
                            [this.model.sequelize.fn('SUM', this.model.sequelize.col('amount')), 'revenue']
                        ],
                        where: {
                            startedAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                        },
                        group: ['frequency']
                    })
                ]);
                const byTierMap = byTier.reduce((acc, item) => {
                    acc[item.tier] = {
                        count: parseInt(item.get('count')),
                        revenue: parseFloat(item.get('revenue')) || 0
                    };
                    return acc;
                }, {});
                const byFrequencyMap = byFrequency.reduce((acc, item) => {
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting patron analytics', { error, dateFrom, dateTo });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async exportPatronData(format = 'csv') {
        return tracer_1.tracer.startActiveSpan('repository.PatronSubscription.exportPatronData', async (span) => {
            try {
                span.setAttribute('format', format);
                const subscriptions = await this.findAll({
                    include: ['patron'],
                    raw: true,
                    nest: true
                });
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error exporting patron data', { error, format });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    calculateMonthsActive(startedAt, frequency) {
        const now = new Date();
        const diffMonths = (now.getFullYear() - startedAt.getFullYear()) * 12 + (now.getMonth() - startedAt.getMonth());
        switch (frequency) {
            case PatronSubscription_1.SubscriptionFrequency.MONTHLY:
                return diffMonths;
            case PatronSubscription_1.SubscriptionFrequency.YEARLY:
                return Math.floor(diffMonths / 12);
            case PatronSubscription_1.SubscriptionFrequency.LIFETIME:
                return 1; // One-time payment
            default:
                return 0;
        }
    }
}
exports.PatronSubscriptionRepository = PatronSubscriptionRepository;
//# sourceMappingURL=PatronSubscriptionRepository.js.map