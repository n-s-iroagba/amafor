"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const sequelize_1 = require("sequelize");
const User_1 = require("@models/User");
const BaseRepository_1 = require("./BaseRepository");
const AuditLogRepository_1 = require("./AuditLogRepository");
const tracer_1 = __importDefault(require("@utils/tracer"));
const logger_1 = __importDefault(require("@utils/logger"));
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.User);
        this.auditLogRepository = new AuditLogRepository_1.AuditLogRepository();
    }
    async countNewToday() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return this.model.count({
            where: {
                createdAt: { [sequelize_1.Op.gte]: startOfDay }
            }
        });
    }
    async findByEmail(email, includePassword = false) {
        return tracer_1.default.startActiveSpan('repository.User.findByEmail', async (span) => {
            try {
                span.setAttribute('email', email);
                const attributes = includePassword ? undefined : { exclude: ['passwordHash'] };
                const user = await this.model.findOne({
                    where: { email },
                    attributes
                });
                span.setAttribute('found', !!user);
                return user;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error finding user by email: ${email}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async createWithAudit(data, auditData) {
        return tracer_1.default.startActiveSpan('repository.User.createWithAudit', async (span) => {
            const transaction = await User_1.User.sequelize.transaction();
            try {
                span.setAttribute('email', data.email);
                const user = await this.create(data, { transaction });
                // Create audit log
                await this.auditLogRepository.create({
                    userId: user.id,
                    userEmail: user.email,
                    userType: user.userType,
                    action: 'create',
                    entityType: 'user',
                    entityId: user.id,
                    entityName: `${user.firstName} ${user.lastName}`,
                    newValue: user.toJSON(),
                    changes: Object.keys(data).map(key => ({
                        field: key,
                        newValue: data[key]
                    })),
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`User created with audit: ${user.id}`);
                return user;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating user with audit', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateWithAudit(id, data, auditData) {
        return tracer_1.default.startActiveSpan('repository.User.updateWithAudit', async (span) => {
            const transaction = await User_1.User.sequelize.transaction();
            try {
                span.setAttribute('id', id);
                const user = await this.findById(id, { transaction });
                if (!user) {
                    throw new Error('User not found');
                }
                const oldValue = user.toJSON();
                // Update user
                await user.update(data, { transaction });
                // Get changes
                const changes = Object.keys(data)
                    .filter(key => user.get(key) !== oldValue[key])
                    .map(key => ({
                    field: key,
                    oldValue: oldValue[key],
                    newValue: data[key]
                }));
                // Create audit log
                await this.auditLogRepository.create({
                    userId: auditData.userId || id,
                    userEmail: auditData.userEmail || user.email,
                    userType: auditData.userType || user.userType,
                    action: 'update',
                    entityType: 'user',
                    entityId: id,
                    entityName: `${user.firstName} ${user.lastName}`,
                    oldValue,
                    newValue: user.toJSON(),
                    changes,
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`User updated with audit: ${id}`);
                return user;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating user with audit: ${id}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateLoginInfo(id, ipAddress) {
        return tracer_1.default.startActiveSpan('repository.User.updateLoginInfo', async (span) => {
            try {
                span.setAttribute('id', id);
                await this.model.update({
                    lastLogin: new Date(),
                    loginAttempts: 0,
                    lockUntil: null
                }, { where: { id } });
                logger_1.default.info(`User login info updated: ${id}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating user login info: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async incrementLoginAttempts(id) {
        return tracer_1.default.startActiveSpan('repository.User.incrementLoginAttempts', async (span) => {
            try {
                span.setAttribute('id', id);
                await this.model.update({
                    loginAttempts: this.model.sequelize.literal('loginAttempts + 1'),
                    lockUntil: this.model.sequelize.literal('CASE WHEN loginAttempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE) ELSE lockUntil END')
                }, { where: { id } });
                logger_1.default.warn(`User login attempts incremented: ${id}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error incrementing user login attempts: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findByType(userType, options) {
        return tracer_1.default.startActiveSpan('repository.User.findByType', async (span) => {
            try {
                span.setAttribute('userType', userType);
                const users = await this.findAll({
                    where: { userType },
                    ...options
                });
                span.setAttribute('count', users.length);
                return users;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error finding users by type: ${userType}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findPendingVerifications() {
        return tracer_1.default.startActiveSpan('repository.User.findPendingVerifications', async (span) => {
            try {
                const users = await this.findAll({
                    where: {
                        status: User_1.UserStatus.PENDING_VERIFICATION,
                        userType: {
                            [sequelize_1.Op.in]: [User_1.UserType.SCOUT, User_1.UserType.ADVERTISER]
                        }
                    },
                    order: [['createdAt', 'ASC']]
                });
                span.setAttribute('count', users.length);
                return users;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding pending verifications', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async verifyUser(id, verificationData) {
        return tracer_1.default.startActiveSpan('repository.User.verifyUser', async (span) => {
            const transaction = await User_1.User.sequelize.transaction();
            try {
                span.setAttribute('id', id);
                const user = await this.findById(id, { transaction });
                if (!user) {
                    throw new Error('User not found');
                }
                const oldValue = user.toJSON();
                await user.update({
                    status: User_1.UserStatus.ACTIVE,
                    emailVerified: true,
                    verificationToken: null,
                    verificationTokenExpires: null,
                    ...verificationData
                }, { transaction });
                // Create audit log
                await this.auditLogRepository.create({
                    userId: verificationData.verifiedBy,
                    userEmail: verificationData.verifiedByEmail,
                    userType: verificationData.verifiedByType,
                    action: 'update',
                    entityType: 'user',
                    entityId: id,
                    entityName: `${user.firstName} ${user.lastName}`,
                    oldValue,
                    newValue: user.toJSON(),
                    changes: [
                        { field: 'status', oldValue: oldValue.status, newValue: User_1.UserStatus.ACTIVE },
                        { field: 'emailVerified', oldValue: oldValue.emailVerified, newValue: true }
                    ],
                    ipAddress: verificationData.ipAddress,
                    userAgent: verificationData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`User verified: ${id}`);
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error verifying user: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async searchUsers(query, options) {
        return tracer_1.default.startActiveSpan('repository.User.searchUsers', async (span) => {
            try {
                span.setAttribute('query', query);
                const users = await this.findAll({
                    where: {
                        [sequelize_1.Op.or]: [
                            { email: { [sequelize_1.Op.like]: `%${query}%` } },
                            { firstName: { [sequelize_1.Op.like]: `%${query}%` } },
                            { lastName: { [sequelize_1.Op.like]: `%${query}%` } }
                        ]
                    },
                    ...options
                });
                span.setAttribute('count', users.length);
                return users;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error searching users: ${query}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getDashboardStats() {
        return tracer_1.default.startActiveSpan('repository.User.getDashboardStats', async (span) => {
            try {
                const [total, active, pending, byType] = await Promise.all([
                    this.count(),
                    this.count({ where: { status: User_1.UserStatus.ACTIVE } }),
                    this.count({ where: { status: User_1.UserStatus.PENDING_VERIFICATION } }),
                    this.model.findAll({
                        attributes: ['userType', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        group: ['userType']
                    })
                ]);
                const byTypeMap = byType.reduce((acc, item) => {
                    acc[item.userType] = parseInt(item.get('count'));
                    return acc;
                }, {});
                span.setAttributes({
                    total,
                    active,
                    pending,
                    byTypeCount: Object.keys(byTypeMap).length
                });
                return {
                    total,
                    active,
                    pending,
                    byType: byTypeMap
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting user dashboard stats', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map