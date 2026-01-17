"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationRepository = void 0;
const sequelize_1 = require("sequelize");
const Donation_1 = require("@models/Donation");
const BaseRepository_1 = require("./BaseRepository");
const AuditLogRepository_1 = require("./AuditLogRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
class DonationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Donation_1.Donation);
        this.auditLogRepository = new AuditLogRepository_1.AuditLogRepository();
    }
    async findByReference(reference) {
        return this.model.findOne({ where: { paymentReference: reference } });
    }
    async createWithAudit(data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Donation.createWithAudit', async (span) => {
            const transaction = await Donation_1.Donation.sequelize.transaction();
            try {
                span.setAttribute('amount', data.amount);
                span.setAttribute('donorEmail', data.donorEmail);
                const donation = await this.create(data, { transaction });
                // Create audit log
                await this.auditLogRepository.create({
                    userId: auditData.userId || donation.donorId,
                    userEmail: auditData.userEmail || donation.donorEmail,
                    userType: auditData.userType || 'donor',
                    action: 'create',
                    entityType: 'donation',
                    entityId: donation.id,
                    entityName: `Donation from ${donation.donorFirstName} ${donation.donorLastName}`,
                    newValue: donation.toJSON(),
                    changes: Object.keys(data).map(key => ({
                        field: key,
                        newValue: data[key]
                    })),
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Donation created with audit: ${donation.id}`);
                return donation;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating donation with audit', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateWithAudit(id, data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Donation.updateWithAudit', async (span) => {
            const transaction = await Donation_1.Donation.sequelize.transaction();
            try {
                span.setAttribute('id', id);
                const donation = await this.findById(id, { transaction });
                if (!donation) {
                    throw new Error('Donation not found');
                }
                const oldValue = donation.toJSON();
                // Update donation
                await donation.update(data, { transaction });
                // Get changes
                const changes = Object.keys(data)
                    .filter(key => donation.get(key) !== oldValue[key])
                    .map(key => ({
                    field: key,
                    oldValue: oldValue[key],
                    newValue: data[key]
                }));
                // Create audit log
                await this.auditLogRepository.create({
                    userId: auditData.userId,
                    userEmail: auditData.userEmail,
                    userType: auditData.userType,
                    action: 'update',
                    entityType: 'donation',
                    entityId: id,
                    entityName: `Donation from ${donation.donorFirstName} ${donation.donorLastName}`,
                    oldValue,
                    newValue: donation.toJSON(),
                    changes,
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Donation updated with audit: ${id}`);
                return donation;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating donation with audit: ${id}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updatePaymentStatus(reference, status, paystackReference, completedAt) {
        return tracer_1.tracer.startActiveSpan('repository.Donation.updatePaymentStatus', async (span) => {
            const transaction = await Donation_1.Donation.sequelize.transaction();
            try {
                span.setAttribute('reference', reference);
                span.setAttribute('status', status);
                span.setAttribute('paystackReference', paystackReference);
                const donation = await this.findOne({
                    where: { paymentReference: reference },
                    transaction
                });
                if (!donation) {
                    throw new Error('Donation not found');
                }
                const oldValue = donation.toJSON();
                const updateData = {
                    status,
                    paystackReference,
                    ...(completedAt && { completedAt })
                };
                await donation.update(updateData, { transaction });
                // Create audit log
                await this.auditLogRepository.create({
                    userId: donation.donorId,
                    userEmail: donation.donorEmail,
                    userType: 'donor',
                    action: 'payment',
                    entityType: 'donation',
                    entityId: donation.id,
                    entityName: `Donation from ${donation.donorFirstName} ${donation.donorLastName}`,
                    oldValue,
                    newValue: donation.toJSON(),
                    changes: [
                        { field: 'status', oldValue: oldValue.status, newValue: status },
                        { field: 'paystackReference', oldValue: oldValue.paystackReference, newValue: paystackReference }
                    ]
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Donation payment status updated: ${donation.id}`, { status });
                return donation;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating donation payment status: ${reference}`, { error, status });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findWithFilters(filters, sort = {}, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Donation.findWithFilters', async (span) => {
            try {
                span.setAttributes({
                    filters: JSON.stringify(filters),
                    sort: JSON.stringify(sort)
                });
                const where = {};
                // Apply filters
                if (filters.status) {
                    where.status = filters.status;
                }
                if (filters.donorEmail) {
                    where.donorEmail = filters.donorEmail;
                }
                if (filters.dateFrom || filters.dateTo) {
                    where.createdAt = {};
                    if (filters.dateFrom) {
                        where.createdAt[sequelize_1.Op.gte] = filters.dateFrom;
                    }
                    if (filters.dateTo) {
                        where.createdAt[sequelize_1.Op.lte] = filters.dateTo;
                    }
                }
                if (filters.search) {
                    where[sequelize_1.Op.or] = [
                        { donorEmail: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { donorFirstName: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { donorLastName: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { paymentReference: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { paystackReference: { [sequelize_1.Op.like]: `%${filters.search}%` } }
                    ];
                }
                // Apply sorting
                const order = [];
                if (sort.sortBy) {
                    order.push([sort.sortBy, sort.sortOrder?.toUpperCase() || 'DESC']);
                }
                else {
                    order.push(['createdAt', 'DESC']);
                }
                const options = {
                    where,
                    order,
                    include: ['donor']
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
                logger_1.default.error('Error finding donations with filters', { error, filters, sort });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findSupporters(pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Donation.findSupporters', async (span) => {
            try {
                const supporters = await this.findAll({
                    where: {
                        status: Donation_1.DonationStatus.COMPLETED,
                        optInSupporterWall: true,
                        anonymous: false
                    },
                    order: [
                        ['donorLastName', 'ASC'],
                        ['donorFirstName', 'ASC']
                    ],
                    raw: true
                });
                // Transform for supporter wall
                const supporterData = supporters.map(donation => ({
                    name: `${donation.donorFirstName} ${donation.donorLastName}`,
                    displayName: `${donation.donorFirstName} ${donation.donorLastName.charAt(0)}.`,
                    amount: donation.amount,
                    donatedAt: donation.completedAt || donation.createdAt,
                    message: donation.message
                }));
                // Handle pagination manually for transformed data
                const page = pagination?.page || 1;
                const limit = pagination?.limit || 20;
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedData = supporterData.slice(startIndex, endIndex);
                const totalPages = Math.ceil(supporterData.length / limit);
                span.setAttributes({
                    total: supporterData.length,
                    page,
                    totalPages
                });
                return {
                    data: paginatedData,
                    total: supporterData.length,
                    page,
                    totalPages
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding supporters', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getDonationStats() {
        return tracer_1.tracer.startActiveSpan('repository.Donation.getDonationStats', async (span) => {
            try {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const [totalDonations, totalAmount, averageResult, recentDonations, topDonors] = await Promise.all([
                    this.count({ where: { status: Donation_1.DonationStatus.COMPLETED } }),
                    this.model.sum('amount', { where: { status: Donation_1.DonationStatus.COMPLETED } }),
                    this.model.findOne({
                        attributes: [[this.model.sequelize.fn('AVG', this.model.sequelize.col('amount')), 'average']],
                        where: { status: Donation_1.DonationStatus.COMPLETED }
                    }),
                    this.count({
                        where: {
                            status: Donation_1.DonationStatus.COMPLETED,
                            completedAt: { [sequelize_1.Op.gte]: thirtyDaysAgo }
                        }
                    }),
                    this.model.findAll({
                        attributes: [
                            'donorEmail',
                            'donorFirstName',
                            'donorLastName',
                            [this.model.sequelize.fn('SUM', this.model.sequelize.col('amount')), 'totalDonated'],
                            [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'donationCount'],
                            [this.model.sequelize.fn('MAX', this.model.sequelize.col('completedAt')), 'lastDonation']
                        ],
                        where: { status: Donation_1.DonationStatus.COMPLETED },
                        group: ['donorEmail', 'donorFirstName', 'donorLastName'],
                        order: [[this.model.sequelize.literal('totalDonated'), 'DESC']],
                        limit: 10
                    })
                ]);
                const averageDonation = averageResult ? parseFloat(averageResult.get('average') || 0) : 0;
                const topDonorsData = topDonors.map(item => ({
                    donorEmail: item.donorEmail,
                    name: `${item.donorFirstName} ${item.donorLastName}`,
                    totalDonated: parseFloat(item.get('totalDonated')) || 0,
                    donationCount: parseInt(item.get('donationCount')) || 0,
                    lastDonation: item.get('lastDonation')
                }));
                const stats = {
                    totalDonations,
                    totalAmount: totalAmount || 0,
                    averageDonation,
                    recentDonations,
                    topDonors: topDonorsData
                };
                span.setAttributes({
                    totalDonations: stats.totalDonations,
                    totalAmount: stats.totalAmount,
                    recentDonations: stats.recentDonations
                });
                return stats;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting donation stats', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getFinancialAnalytics(dateFrom, dateTo, type = 'all') {
        return tracer_1.tracer.startActiveSpan('repository.Donation.getFinancialAnalytics', async (span) => {
            try {
                span.setAttributes({
                    dateFrom: dateFrom.toISOString(),
                    dateTo: dateTo.toISOString(),
                    type
                });
                const where = {
                    status: Donation_1.DonationStatus.COMPLETED,
                    completedAt: { [sequelize_1.Op.between]: [dateFrom, dateTo] }
                };
                const [donations, totalRevenue, transactionCount, averageResult] = await Promise.all([
                    this.findAll({ where }),
                    this.model.sum('amount', { where }),
                    this.count({ where }),
                    this.model.findOne({
                        attributes: [[this.model.sequelize.fn('AVG', this.model.sequelize.col('amount')), 'average']],
                        where
                    })
                ]);
                const averageTransactionValue = averageResult ? parseFloat(averageResult.get('average') || 0) : 0;
                // Get top donors for the period
                const topDonorsResult = await this.model.findAll({
                    attributes: [
                        'donorEmail',
                        'donorFirstName',
                        'donorLastName',
                        [this.model.sequelize.fn('SUM', this.model.sequelize.col('amount')), 'totalDonated'],
                        [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'donationCount']
                    ],
                    where,
                    group: ['donorEmail', 'donorFirstName', 'donorLastName'],
                    order: [[this.model.sequelize.literal('totalDonated'), 'DESC']],
                    limit: 10
                });
                const topDonors = topDonorsResult.map(item => ({
                    donorEmail: item.donorEmail,
                    name: `${item.donorFirstName} ${item.donorLastName}`,
                    totalDonated: parseFloat(item.get('totalDonated')) || 0,
                    donationCount: parseInt(item.get('donationCount')) || 0
                }));
                // Generate revenue trend
                const revenueTrend = this.generateRevenueTrend(dateFrom, dateTo, donations);
                const analytics = {
                    totalRevenue: totalRevenue || 0,
                    transactionCount,
                    averageTransactionValue,
                    topDonors,
                    revenueTrend
                };
                // Add bySource if type is 'all' (would include advertising and patronage)
                if (type === 'all') {
                    analytics.bySource = {
                        donations: totalRevenue || 0,
                        advertising: 0,
                        patronage: 0 // Would come from PatronSubscriptionRepository
                    };
                }
                span.setAttribute('totalRevenue', analytics.totalRevenue);
                return analytics;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting financial analytics', { error, dateFrom, dateTo, type });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    generateRevenueTrend(dateFrom, dateTo, donations) {
        const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
        const period = days <= 7 ? 'day' : days <= 30 ? 'week' : 'month';
        const revenueTrend = [];
        let currentDate = new Date(dateFrom);
        while (currentDate <= dateTo) {
            let periodEnd;
            let periodLabel;
            switch (period) {
                case 'day':
                    periodEnd = new Date(currentDate);
                    periodEnd.setDate(periodEnd.getDate() + 1);
                    periodLabel = currentDate.toISOString().split('T')[0];
                    break;
                case 'week':
                    periodEnd = new Date(currentDate);
                    periodEnd.setDate(periodEnd.getDate() + 7);
                    periodLabel = `Week of ${currentDate.toISOString().split('T')[0]}`;
                    break;
                case 'month':
                    periodEnd = new Date(currentDate);
                    periodEnd.setMonth(periodEnd.getMonth() + 1);
                    periodLabel = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
                    break;
                default:
                    periodEnd = new Date(currentDate);
                    periodEnd.setDate(periodEnd.getDate() + 1);
                    periodLabel = currentDate.toISOString().split('T')[0];
            }
            // Calculate revenue for this period
            const periodRevenue = donations
                .filter(donation => {
                const donationDate = donation.completedAt || donation.createdAt;
                return donationDate >= currentDate && donationDate < periodEnd;
            })
                .reduce((sum, donation) => sum + donation.amount, 0);
            revenueTrend.push({
                period: periodLabel,
                revenue: periodRevenue,
                growth: 0 // Would need previous period for comparison
            });
            currentDate = periodEnd;
        }
        return revenueTrend;
    }
    async exportDonations(format = 'csv') {
        return tracer_1.tracer.startActiveSpan('repository.Donation.exportDonations', async (span) => {
            try {
                span.setAttribute('format', format);
                const donations = await this.findAll({
                    where: { status: Donation_1.DonationStatus.COMPLETED },
                    order: [['completedAt', 'DESC']],
                    raw: true
                });
                // Transform for export
                const exportData = donations.map(donation => ({
                    id: donation.id,
                    amount: donation.amount,
                    currency: donation.currency,
                    donorName: `${donation.donorFirstName} ${donation.donorLastName}`,
                    donorEmail: donation.donorEmail,
                    status: donation.status,
                    paymentReference: donation.paymentReference,
                    paystackReference: donation.paystackReference,
                    optInSupporterWall: donation.optInSupporterWall,
                    anonymous: donation.anonymous,
                    createdAt: donation.createdAt,
                    completedAt: donation.completedAt
                }));
                span.setAttribute('count', exportData.length);
                return exportData;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error exporting donations', { error, format });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getReceiptData(id, email) {
        return tracer_1.tracer.startActiveSpan('repository.Donation.getReceiptData', async (span) => {
            try {
                span.setAttribute('id', id);
                if (email)
                    span.setAttribute('email', email);
                const where = { id };
                if (email) {
                    where.donorEmail = email;
                }
                const donation = await this.findOne({
                    where,
                    include: ['donor'],
                    raw: true,
                    nest: true
                });
                if (!donation) {
                    throw new Error('Donation not found or email mismatch');
                }
                // Format receipt data
                const receiptData = {
                    id: donation.id,
                    amount: donation.amount,
                    currency: donation.currency,
                    donor: {
                        name: `${donation.donorFirstName} ${donation.donorLastName}`,
                        email: donation.donorEmail
                    },
                    status: donation.status,
                    reference: donation.paymentReference,
                    transactionId: donation.paystackReference,
                    date: donation.completedAt || donation.createdAt,
                    message: donation.message,
                    clubDetails: {
                        name: 'Amafor Gladiators FC',
                        address: 'Amafor, Enugu State, Nigeria',
                        email: 'donations@amaforgladiatorsfc.com'
                    }
                };
                return receiptData;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error getting donation receipt data: ${id}`, { error, email });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.DonationRepository = DonationRepository;
//# sourceMappingURL=DonationRepository.js.map