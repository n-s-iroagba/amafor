import { UserRepository } from '../repositories';
import { AuditService } from './AuditService';
import { User, UserAttributes } from '../models';
import { structuredLogger, tracer } from '../utils';

export class UserService {
  private userRepository: UserRepository;
  private auditService: AuditService;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditService = new AuditService();
  }

  public async getUserProfile(userId: string): Promise<User | null> {
    return tracer.startActiveSpan('service.UserService.getUserProfile', async (span) => {
      try {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async updateUserProfile(userId: string, data: Partial<UserAttributes>): Promise<User> {
    return tracer.startActiveSpan('service.UserService.updateUserProfile', async (span) => {
      try {
        // Remove sensitive fields
        delete (data as any).passwordHash;
        delete (data as any).roles;
        
        const [affectedCount, updatedUsers] = await this.userRepository.update(userId, data);
        
        if (affectedCount === 0) throw new Error('User not found or no changes made');
        
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
          changes: Object.keys(data).map(key => ({ field: key, newValue: (data as any)[key] })),
          metadata: {},
          ipAddress: '0.0.0.0'
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

  public async verifyUser(adminId: string, targetUserId: string, status: string): Promise<User> {
    return tracer.startActiveSpan('service.UserService.verifyUser', async (span) => {
      try {
        const [_, updatedUsers] = await this.userRepository.update(targetUserId, { status });
        
        if (!updatedUsers || updatedUsers.length === 0) throw new Error('User not found');

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
}