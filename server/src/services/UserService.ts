import { UserRepository } from '../repositories';
import { AuditService } from './AuditService';

import { structuredLogger, tracer } from '../utils';
import User, { UserAttributes, UserStatus } from '@models/User';
import Advertiser from '@models/Advertiser';
import { AuditAction, EntityType } from '@models/AuditLog';

export class UserService {
  private userRepository: UserRepository;
  private auditService: AuditService;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditService = new AuditService();
  }

  /**
   * Get current user profile
   * @api GET /users/profile
   */
  public async getUserProfile(userId: string): Promise<User | null> {
    return tracer.startActiveSpan('service.UserService.getUserProfile', async (span) => {
      try {
        const user = await this.userRepository.findById(userId, {
          include: [{
            model: Advertiser,
            as: 'advertiserProfile'
          }]
        });
        if (!user) throw new Error('User not found');

        // Map if it's an advertiser to provide a flat structure for the review page if needed,
        // or just let the frontend handle nested data if it's updated.
        // Actually, the AdvertiserReviewDetail page expects a flat Advertiser object.
        if (user.roles.includes('advertiser')) {
          return {
            id: user.id,
            name: user.advertiserProfile?.companyName || `${user.firstName} ${user.lastName}`,
            contact: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: user.status,
            industry: user.advertiserProfile?.industry || 'General',
            website: user.advertiserProfile?.website || '',
            registered: (user as any).advertiserProfile?.id?.split('-')[0].toUpperCase() || 'REG-PENDING', // Mocking reg number if not present
          } as any;
        }

        return user;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Update user profile
   */
  public async updateUserProfile(userId: string, data: Partial<UserAttributes>): Promise<User> {
    return tracer.startActiveSpan('service.UserService.updateUserProfile', async (span) => {
      try {
        // Remove sensitive fields
        delete (data as any).passwordHash;
        delete (data as any).roles;

        const [affectedCount, updatedUsers] = await this.userRepository.update(userId, data);

        if (affectedCount === 0) throw new Error('User not found or no changes made');

        const updatedUser = updatedUsers[0];

        // Audit the update via AuditService
        await this.auditService.logAction({
          userId,
          userEmail: updatedUser.email,
          userType: updatedUser.roles[0] || 'advertiser',
          action: AuditAction.UPDATE,
          entityType: EntityType.USER,
          entityId: userId,
          entityName: `${updatedUser.firstName} ${updatedUser.lastName}`,
          changes: Object.keys(data).map(key => ({ field: key, newValue: (data as any)[key] })),
          metadata: {},
          ipAddress: '0.0.0.0',
          timestamp: new Date()
        });

        return updatedUser;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to update profile', { userId, error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Verify user account (Admin only)
   */
  public async verifyUser(adminId: string, targetUserId: string, status: string): Promise<User> {
    return tracer.startActiveSpan('service.UserService.verifyUser', async (span) => {
      try {
        const [_, updatedUsers] = await this.userRepository.update(targetUserId, { status: status as UserStatus });

        if (!updatedUsers || updatedUsers.length === 0) throw new Error('User not found');

        const user = updatedUsers[0];

        // Also update Advertiser status if it exists
        if (user.roles.includes('advertiser')) {
          await Advertiser.update(
            { status: status === UserStatus.ACTIVE ? 'active' : 'suspended' },
            { where: { userId: targetUserId } }
          );
        }

        await this.auditService.logAction({
          userId: adminId,
          userEmail: 'admin',
          userType: 'admin',
          action: AuditAction.UPDATE,
          entityType: EntityType.USER,
          entityId: targetUserId,
          entityName: 'Verification Status',
          changes: [{ field: 'status', newValue: status }],
          metadata: { adminId },
          ipAddress: '0.0.0.0',
          timestamp: new Date()
        });

        structuredLogger.business('USER_VERIFICATION', 0, adminId, { targetUserId, status });

        return updatedUsers[0];
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to verify user', { adminId, targetUserId, error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Get pending advertisers for verification queue
   */
  public async getPendingAdvertisers(): Promise<any[]> {
    return tracer.startActiveSpan('service.UserService.getPendingAdvertisers', async (span) => {
      try {
        const users = await this.userRepository.findAll({
          where: {
            role: 'advertiser',
            status: UserStatus.PENDING_VERIFICATION
          },
          include: [{
            model: Advertiser,
            as: 'advertiserProfile'
          }]
        });

        // Map to flat structure expected by frontend Advertiser interface
        return users.map((user: any) => ({
          id: user.id,
          company: user.advertiserProfile?.companyName || 'Unknown Company',
          contact: `${user.firstName} ${user.lastName}`,
          email: user.email,
          status: user.status,
          industry: user.advertiserProfile?.industry || 'General',
          website: user.advertiserProfile?.website || ''
        }));
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to fetch pending advertisers', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async getAllUsers(query: any = {}): Promise<User[]> {
    return tracer.startActiveSpan('service.UserService.getAllUsers', async (span) => {
      try {
        const users = await this.userRepository.findAll({
          order: [['createdAt', 'DESC']]
        });
        return users;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to fetch all users', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async getUserById(userId: string): Promise<User | null> {
    return this.getUserProfile(userId);
  }

  public async createUser(userData: any): Promise<User> {
    return tracer.startActiveSpan('service.UserService.createUser', async (span) => {
      try {
        const user = await this.userRepository.create(userData);
        return user;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to create user', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async deleteUser(userId: string, adminId: string): Promise<boolean> {
    return tracer.startActiveSpan('service.UserService.deleteUser', async (span) => {
      try {
        const deleted = await this.userRepository.delete(userId);
        if (!deleted) throw new Error('User not found or could not be deleted');

        await this.auditService.logAction({
          userId: adminId,
          userEmail: 'admin',
          userType: 'admin',
          action: AuditAction.DELETE,
          entityType: EntityType.USER,
          entityId: userId,
          entityName: 'User',
          changes: [],
          metadata: { adminId },
          ipAddress: '0.0.0.0',
          timestamp: new Date()
        });

        return true;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to delete user', { userId, error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}