"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedSourceRepository = void 0;
// repositories/RssFeedRepository.ts
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const RssFeedSource_1 = require("@models/RssFeedSource");
const AuditLogRepository_1 = require("./AuditLogRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = __importDefault(require("@utils/tracer"));
class RssFeedSourceRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(RssFeedSource_1.RssFeedSource);
        this.auditLogRepository = new AuditLogRepository_1.AuditLogRepository();
    }
    async searchFeeds(search, filters = {}, sort = {}, pagination) {
        return tracer_1.default.startActiveSpan('repository.RssFeedSource.searchFeeds', async (span) => {
            try {
                span.setAttributes({
                    search,
                    filters: JSON.stringify(filters),
                    sort: JSON.stringify(sort)
                });
                const where = { ...filters };
                // Apply search
                if (search) {
                    where[sequelize_1.Op.or] = [
                        { name: { [sequelize_1.Op.like]: `%${search}%` } },
                        { feedUrl: { [sequelize_1.Op.like]: `%${search}%` } },
                        { description: { [sequelize_1.Op.like]: `%${search}%` } }
                    ];
                }
                // Apply sorting
                const order = [];
                if (sort.sortBy) {
                    order.push([sort.sortBy, sort.sortOrder?.toUpperCase() || 'ASC']);
                }
                else {
                    order.push(['name', 'ASC']);
                }
                const options = {
                    where,
                    order
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
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('Error searching RSS feeds', { error, search, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateFetchStatus(id, status, lastError) {
        return tracer_1.default.startActiveSpan('repository.RssFeedSource.updateFetchStatus', async (span) => {
            try {
                span.setAttributes({
                    id,
                    status,
                    lastError
                });
                const updateData = {
                    fetchStatus: status,
                    lastFetchedAt: new Date()
                };
                if (lastError) {
                    updateData.lastError = lastError;
                }
                await this.update(id, updateData);
                logger_1.default.info(`Updated fetch status for RSS feed ${id}: ${status}`);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error updating fetch status for RSS feed: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getFeedsNeedingUpdate(thresholdMinutes = 30) {
        return tracer_1.default.startActiveSpan('repository.RssFeedSource.getFeedsNeedingUpdate', async (span) => {
            try {
                span.setAttribute('thresholdMinutes', thresholdMinutes);
                const thresholdDate = new Date(Date.now() - thresholdMinutes * 60 * 1000);
                const feeds = await this.findAll({
                    where: {
                        isActive: true,
                        [sequelize_1.Op.or]: [
                            { lastFetchedAt: { [sequelize_1.Op.lt]: thresholdDate } },
                            { lastFetchedAt: null }
                        ]
                    },
                    order: [
                        ['lastFetchedAt', 'ASC NULLS FIRST'],
                        ['updateFrequency', 'ASC']
                    ]
                });
                span.setAttribute('count', feeds.length);
                return feeds;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('Error getting feeds needing update', { error, thresholdMinutes });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.RssFeedSourceRepository = RssFeedSourceRepository;
//# sourceMappingURL=RssFeedSourceRepository.js.map