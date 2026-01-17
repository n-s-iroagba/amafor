"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const repositories_1 = require("../repositories");
const AuditService_1 = require("./AuditService");
const utils_1 = require("../utils");
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
                    action: 'UPDATE',
                    entityType: 'USER',
                    entityId: userId,
                    entityName: `${updatedUser.firstName} ${updatedUser.lastName}`,
                    changes: Object.keys(data).map(key => ({ field: key, newValue: data[key] })),
                    metadata: {},
                    ipAddress: '0.0.0.0'
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
                    action: 'UPDATE',
                    entityType: 'USER',
                    entityId: targetUserId,
                    entityName: 'Verification Status',
                    changes: [{ field: 'status', newValue: status }],
                    metadata: { adminId },
                    ipAddress: '0.0.0.0'
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
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map