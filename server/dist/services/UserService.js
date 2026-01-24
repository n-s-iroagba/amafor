"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const repositories_1 = require("../repositories");
const AuditService_1 = require("./AuditService");
const utils_1 = require("../utils");
const AuditLog_1 = require("@models/AuditLog");
class UserService {
    constructor() {
        this.userRepository = new repositories_1.UserRepository();
        this.auditService = new AuditService_1.AuditService();
    }
    async getUserProfile(userId) {
        return utils_1.tracer.startActiveSpan('service.UserService.getUserProfile', async (span) => {
            try {
                const user = await this.userRepository.findById(userId);
                if (!user)
                    throw new Error('User not found');
                return user;
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
    async updateUserProfile(userId, data) {
        return utils_1.tracer.startActiveSpan('service.UserService.updateUserProfile', async (span) => {
            try {
                // Remove sensitive fields
                delete data.passwordHash;
                delete data.roles;
                const [affectedCount, updatedUsers] = await this.userRepository.update(userId, data);
                if (affectedCount === 0)
                    throw new Error('User not found or no changes made');
                const updatedUser = updatedUsers[0];
                // Audit the update via AuditService (writes to DB and Logger)
                await this.auditService.logAction({
                    userId,
                    userEmail: updatedUser.email,
                    userType: updatedUser.userType || 'user',
                    action: AuditLog_1.AuditAction.UPDATE,
                    entityType: AuditLog_1.EntityType.USER,
                    entityId: userId,
                    entityName: `${updatedUser.firstName} ${updatedUser.lastName}`,
                    changes: Object.keys(data).map(key => ({ field: key, newValue: data[key] })),
                    metadata: {},
                    ipAddress: '0.0.0.0',
                    timestamp: new Date()
                });
                return updatedUser;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to update profile', { userId, error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async verifyUser(adminId, targetUserId, status) {
        return utils_1.tracer.startActiveSpan('service.UserService.verifyUser', async (span) => {
            try {
                const [_, updatedUsers] = await this.userRepository.update(targetUserId, { status });
                if (!updatedUsers || updatedUsers.length === 0)
                    throw new Error('User not found');
                await this.auditService.logAction({
                    userId: adminId,
                    userEmail: 'admin',
                    userType: 'admin',
                    action: AuditLog_1.AuditAction.UPDATE,
                    entityType: AuditLog_1.EntityType.USER,
                    entityId: targetUserId,
                    entityName: 'Verification Status',
                    changes: [{ field: 'status', newValue: status }],
                    metadata: { adminId },
                    ipAddress: '0.0.0.0',
                    timestamp: new Date()
                });
                utils_1.structuredLogger.business('USER_VERIFICATION', 0, adminId, { targetUserId, status });
                return updatedUsers[0];
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to verify user', { adminId, targetUserId, error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getPendingAdvertisers() {
        return utils_1.tracer.startActiveSpan('service.UserService.getPendingAdvertisers', async (span) => {
            try {
                const users = await this.userRepository.findAll({
                    where: {
                        userType: 'advertiser',
                        status: 'PENDING'
                    }
                });
                return users;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to fetch pending advertisers', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getAllUsers(query = {}) {
        return utils_1.tracer.startActiveSpan('service.UserService.getAllUsers', async (span) => {
            try {
                const users = await this.userRepository.findAll({
                    order: [['createdAt', 'DESC']]
                });
                return users;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to fetch all users', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getUserById(userId) {
        return this.getUserProfile(userId);
    }
    async createUser(userData) {
        return utils_1.tracer.startActiveSpan('service.UserService.createUser', async (span) => {
            try {
                // Simplified create for admin purposes - assuming repository handles validation/hashing if strictly typed, 
                // otherwise we might need to hash password here if passed.
                const user = await this.userRepository.create(userData);
                return user;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to create user', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async deleteUser(userId, adminId) {
        return utils_1.tracer.startActiveSpan('service.UserService.deleteUser', async (span) => {
            try {
                const deleted = await this.userRepository.delete(userId);
                if (!deleted)
                    throw new Error('User not found or could not be deleted');
                await this.auditService.logAction({
                    userId: adminId,
                    userEmail: 'admin',
                    userType: 'admin',
                    action: AuditLog_1.AuditAction.DELETE,
                    entityType: AuditLog_1.EntityType.USER,
                    entityId: userId,
                    entityName: 'User',
                    changes: [],
                    metadata: { adminId },
                    ipAddress: '0.0.0.0',
                    timestamp: new Date()
                });
                return true;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to delete user', { userId, error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map