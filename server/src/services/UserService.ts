import { Op } from 'sequelize';
import { UserRepository } from '../repositories';
import { AuditService } from './AuditService';
import { structuredLogger, tracer } from '../utils';
import User, { UserAttributes, UserRole, UserStatus } from '@models/User';
import Advertiser from '@models/Advertiser';
import { AuditAction, EntityType } from '@models/AuditLog';
import { BadRequestError } from '../utils/errors';

/** Roles that end-users (fans/advertisers) create themselves; cannot be assigned via admin invite. */
const END_USER_ROLES: UserRole[] = ['fan', 'advertiser'];

/** All roles available for assignment by an admin. */
export const ASSIGNABLE_ROLES: UserRole[] = [
  'admin',
  'scout',
  'academy_staff',
  'commercial_manager',
  'sports_admin',
  'finance_officer',
  'it_security',
];

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

        if (user.roles.includes('advertiser')) {
          return {
            id: user.id,
            name: user.advertiserProfile?.companyName || `${user.firstName} ${user.lastName}`,
            contact: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: user.status,
            industry: user.advertiserProfile?.industry || 'General',
            website: user.advertiserProfile?.website || '',
            registered: (user as any).advertiserProfile?.id?.split('-')[0].toUpperCase() || 'REG-PENDING',
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
   * Update the current user's own profile.
   * Roles and passwordHash are always stripped — users cannot self-elevate.
   */
  public async updateUserProfile(userId: string, data: Partial<UserAttributes>): Promise<User> {
    return tracer.startActiveSpan('service.UserService.updateUserProfile', async (span) => {
      try {
        // ── RBAC: strip sensitive fields — self-service cannot change roles or password hash ──
        const safe = { ...data };
        delete (safe as any).passwordHash;
        delete (safe as any).roles;
        delete (safe as any).status;
        delete (safe as any).emailVerified;

        const [affectedCount, updatedUsers] = await this.userRepository.update(userId, safe);
        if (affectedCount === 0) throw new Error('User not found or no changes made');

        const updatedUser = updatedUsers[0];

        await this.auditService.logAction({
          userId,
          userEmail: updatedUser.email,
          userType: updatedUser.roles[0] || 'fan',
          action: AuditAction.UPDATE,
          entityType: EntityType.USER,
          entityId: userId,
          entityName: `${updatedUser.firstName} ${updatedUser.lastName}`,
          changes: Object.keys(safe).map(key => ({ field: key, newValue: (safe as any)[key] })),
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
   * Admin-only: update any user's fields, including roles and status.
   * Validates that all supplied roles are within the allowed set.
   */
  public async adminUpdateUser(targetUserId: string, data: Partial<UserAttributes>, adminId: string): Promise<User> {
    return tracer.startActiveSpan('service.UserService.adminUpdateUser', async (span) => {
      try {
        // Validate requested roles if provided
        if (data.roles) {
          const invalidRoles = data.roles.filter(r => !([...ASSIGNABLE_ROLES, ...END_USER_ROLES] as string[]).includes(r));
          if (invalidRoles.length > 0) {
            throw new BadRequestError(`Invalid roles: [${invalidRoles.join(', ')}]`);
          }
        }

        // Strip passwordHash — admins use force-reset flow, not direct hash injection
        const safe = { ...data };
        delete (safe as any).passwordHash;

        const [affectedCount, updatedUsers] = await this.userRepository.update(targetUserId, safe);
        if (affectedCount === 0) throw new Error('User not found or no changes made');

        const updatedUser = updatedUsers[0];

        await this.auditService.logAction({
          userId: adminId,
          userEmail: 'admin',
          userType: 'admin',
          action: AuditAction.UPDATE,
          entityType: EntityType.USER,
          entityId: targetUserId,
          entityName: `${updatedUser.firstName} ${updatedUser.lastName}`,
          changes: Object.keys(safe).map(key => ({ field: key, newValue: (safe as any)[key] })),
          metadata: { adminId },
          ipAddress: '0.0.0.0',
          timestamp: new Date()
        });

        structuredLogger.business('USER_ADMIN_UPDATE', 0, adminId, { targetUserId, changes: Object.keys(safe) });

        return updatedUser;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Admin update user failed', { targetUserId, adminId, error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Admin-only: verify a user's account status.
   */
  public async verifyUser(adminId: string, targetUserId: string, status: string): Promise<User> {
    return tracer.startActiveSpan('service.UserService.verifyUser', async (span) => {
      try {
        const [_, updatedUsers] = await this.userRepository.update(targetUserId, { status: status as UserStatus });
        if (!updatedUsers || updatedUsers.length === 0) throw new Error('User not found');

        const user = updatedUsers[0];

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
   * Admin-only: list all pending advertisers.
   * Uses JSON-column contains check instead of the non-existent scalar `role` column.
   */
  public async getPendingAdvertisers(): Promise<any[]> {
    return tracer.startActiveSpan('service.UserService.getPendingAdvertisers', async (span) => {
      try {
        // Sequelize does not natively support JSON-array-contains in a portable way.
        // Op.like on the serialised JSON column is a safe cross-DB fallback for MySQL/SQLite.
        const users = await this.userRepository.findAll({
          where: {
            status: UserStatus.PENDING_VERIFICATION,
            roles: { [Op.like]: '%"advertiser"%' } as any,
          },
          include: [{
            model: Advertiser,
            as: 'advertiserProfile'
          }]
        });

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