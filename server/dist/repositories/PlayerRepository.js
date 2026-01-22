"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRepository = void 0;
const sequelize_1 = require("sequelize");
const Player_1 = require("@models/Player");
const BaseRepository_1 = require("./BaseRepository");
const AuditLogRepository_1 = require("./AuditLogRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
const AuditLog_1 = require("@models/AuditLog");
class PlayerRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Player_1.Player);
        this.auditLogRepository = new AuditLogRepository_1.AuditLogRepository();
    }
    async createWithAudit(data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Player.createWithAudit', async (span) => {
            const transaction = await Player_1.Player.sequelize.transaction();
            try {
                span.setAttribute('name', data.name);
                const player = await this.create(data, { transaction });
                // Create audit log
                await this.auditLogRepository.create({
                    userId: auditData.userId,
                    userEmail: auditData.userEmail,
                    userType: auditData.userType,
                    action: 'create',
                    entityType: 'player',
                    entityId: player.id,
                    entityName: player.name,
                    newValue: player.toJSON(),
                    changes: Object.keys(data).map(key => ({
                        field: key,
                        newValue: data[key]
                    })),
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Player created with audit: ${player.id}`);
                return player;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating player with audit', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateWithAudit(id, data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Player.updateWithAudit', async (span) => {
            const transaction = await Player_1.Player.sequelize.transaction();
            try {
                span.setAttribute('id', id);
                const player = await this.findById(id, { transaction, include: ['createdBy', 'updatedBy'] });
                if (!player) {
                    throw new Error('Player not found');
                }
                const oldValue = player.toJSON();
                // Update player
                await player.update({
                    ...data,
                    updatedById: auditData.userId
                }, { transaction });
                // Get changes
                const changes = Object.keys(data)
                    .filter(key => {
                    const oldVal = oldValue[key];
                    const newVal = player.get(key);
                    return newVal !== oldVal;
                })
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
                    entityType: 'player',
                    entityId: id,
                    entityName: player.name,
                    oldValue,
                    newValue: player.toJSON(),
                    changes,
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Player updated with audit: ${id}`);
                return player;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating player with audit: ${id}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findWithFilters(filters, sort = {}, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Player.findWithFilters', async (span) => {
            try {
                span.setAttributes({
                    filters: JSON.stringify(filters),
                    sort: JSON.stringify(sort)
                });
                const where = {};
                // Apply filters
                if (filters.position) {
                    where.position = filters.position;
                }
                if (filters.status) {
                    where.status = filters.status;
                }
                if (filters.minAge || filters.maxAge) {
                    const today = new Date();
                    if (filters.minAge) {
                        const minDate = new Date(today.getFullYear() - filters.minAge, today.getMonth(), today.getDate());
                        where.dateOfBirth = { ...where.dateOfBirth, [sequelize_1.Op.lte]: minDate };
                    }
                    if (filters.maxAge) {
                        const maxDate = new Date(today.getFullYear() - filters.maxAge, today.getMonth(), today.getDate());
                        where.dateOfBirth = { ...where.dateOfBirth, [sequelize_1.Op.gte]: maxDate };
                    }
                }
                if (filters.search) {
                    where[sequelize_1.Op.or] = [
                        { name: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { biography: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { nationality: { [sequelize_1.Op.like]: `%${filters.search}%` } }
                    ];
                }
                // Apply sorting
                const order = [];
                if (sort.sortBy) {
                    if (sort.sortBy === 'age') {
                        order.push(['dateOfBirth', sort.sortOrder === 'desc' ? 'ASC' : 'DESC']);
                    }
                    else {
                        order.push([sort.sortBy, sort.sortOrder?.toUpperCase() || 'ASC']);
                    }
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
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding players with filters', { error, filters, sort });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getPlayerStats(id) {
        return tracer_1.tracer.startActiveSpan('repository.Player.getPlayerStats', async (span) => {
            try {
                span.setAttribute('id', id);
                const player = await this.findById(id, {
                    attributes: [
                        'appearances',
                        'goals',
                        'assists',
                        'cleanSheets',
                        'yellowCards',
                        'redCards',
                        'minutesPlayed'
                    ]
                });
                if (!player) {
                    throw new Error('Player not found');
                }
                // Calculate additional stats
                const stats = {
                    appearances: player.appearances,
                    goals: player.goals,
                    assists: player.assists,
                    cleanSheets: player.cleanSheets,
                    yellowCards: player.yellowCards,
                    redCards: player.redCards,
                    minutesPlayed: player.minutesPlayed,
                    averageRating: player.appearances > 0 ?
                        (player.goals + player.assists * 0.5) / player.appearances : 0
                };
                span.setAttributes(stats);
                return stats;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error getting player stats: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updatePlayerStats(id, stats) {
        return tracer_1.tracer.startActiveSpan('repository.Player.updatePlayerStats', async (span) => {
            try {
                span.setAttribute('id', id);
                span.setAttribute('stats', JSON.stringify(stats));
                await this.update(id, {
                    appearances: this.model.sequelize.literal(`appearances + ${stats.appearances || 0}`),
                    goals: this.model.sequelize.literal(`goals + ${stats.goals || 0}`),
                    assists: this.model.sequelize.literal(`assists + ${stats.assists || 0}`),
                    cleanSheets: this.model.sequelize.literal(`cleanSheets + ${stats.cleanSheets || 0}`),
                    yellowCards: this.model.sequelize.literal(`yellowCards + ${stats.yellowCards || 0}`),
                    redCards: this.model.sequelize.literal(`redCards + ${stats.redCards || 0}`),
                    minutesPlayed: this.model.sequelize.literal(`minutesPlayed + ${stats.minutesPlayed || 0}`)
                });
                logger_1.default.info(`Player stats updated: ${id}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating player stats: ${id}`, { error, stats });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getAuditTrail(id, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Player.getAuditTrail', async (span) => {
            try {
                span.setAttribute('id', id);
                return await this.auditLogRepository.findByEntity(AuditLog_1.EntityType.PLAYER, id, pagination);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error getting player audit trail: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findSimilarPlayers(playerId, limit = 5) {
        return tracer_1.tracer.startActiveSpan('repository.Player.findSimilarPlayers', async (span) => {
            try {
                span.setAttributes({
                    playerId,
                    limit
                });
                const player = await this.findById(playerId);
                if (!player) {
                    throw new Error('Player not found');
                }
                const similarPlayers = await this.findAll({
                    where: {
                        id: { [sequelize_1.Op.ne]: playerId },
                        position: player.position,
                        status: Player_1.PlayerStatus.ACTIVE
                    },
                    order: [
                        ['age', 'ASC'],
                        ['appearances', 'DESC']
                    ],
                    limit
                });
                span.setAttribute('count', similarPlayers.length);
                return similarPlayers;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error finding similar players: ${playerId}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getDashboardStats() {
        return tracer_1.tracer.startActiveSpan('repository.Player.getDashboardStats', async (span) => {
            try {
                const [total, active, byPosition, ageResult] = await Promise.all([
                    this.count(),
                    this.count({ where: { status: Player_1.PlayerStatus.ACTIVE } }),
                    this.model.findAll({
                        attributes: ['position', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        group: ['position']
                    }),
                    this.model.findOne({
                        attributes: [[this.model.sequelize.fn('AVG', this.model.sequelize.literal('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE())')), 'avgAge']]
                    })
                ]);
                const byPositionMap = byPosition.reduce((acc, item) => {
                    acc[item.position] = parseInt(item.get('count'));
                    return acc;
                }, {});
                const averageAge = ageResult ? parseFloat(ageResult.get('avgAge') || 0) : 0;
                span.setAttributes({
                    total,
                    active,
                    byPositionCount: Object.keys(byPositionMap).length,
                    averageAge
                });
                return {
                    total,
                    active,
                    byPosition: byPositionMap,
                    averageAge
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting player dashboard stats', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async exportToCSV(fields = ['name', 'position', 'age', 'height']) {
        return tracer_1.tracer.startActiveSpan('repository.Player.exportToCSV', async (span) => {
            try {
                span.setAttribute('fields', JSON.stringify(fields));
                const players = await this.findAll({
                    attributes: fields.includes('age') ?
                        [...fields.filter(f => f !== 'age'), [this.model.sequelize.literal('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE())'), 'age']] :
                        fields,
                    raw: true
                });
                span.setAttribute('count', players.length);
                return players;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error exporting players to CSV', { error, fields });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.PlayerRepository = PlayerRepository;
//# sourceMappingURL=PlayerRepository.js.map