import { FindOptions, Op } from 'sequelize';
import { User, UserAttributes, UserCreationAttributes, UserType, UserStatus } from '@models/User';
import { BaseRepository } from './BaseRepository';
import { AuditLogRepository } from './AuditLogRepository';
import tracer from '@utils/tracer';
import { Span } from '@opentelemetry/api';
import logger from '@utils/logger';

export class UserRepository extends BaseRepository<User> {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    super(User);
    this.auditLogRepository = new AuditLogRepository();
  }

  public async countNewToday(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    return this.model.count({
      where: {
        createdAt: { [Op.gte]: startOfDay }
      }
    });
  }

  async findByEmail(email: string, includePassword: boolean = false): Promise<User | null> {
    return tracer.startActiveSpan('repository.User.findByEmail', async (span: Span) => {
      try {
        span.setAttribute('email', email);
        const attributes: any = includePassword ? undefined : { exclude: ['passwordHash'] };
        
        const user = await this.model.findOne({
          where: { email },
          attributes
        });
        span.setAttribute('found', !!user);
        return user;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error finding user by email: ${email}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async createWithAudit(data: UserCreationAttributes, auditData: any): Promise<User> {
    return tracer.startActiveSpan('repository.User.createWithAudit', async (span: Span) => {
      const transaction = await User.sequelize!.transaction();
      
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
            newValue: (data as any)[key]
          })),
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`User created with audit: ${user.id}`);
        return user;
      } catch (error) {
        await transaction.rollback();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error creating user with audit', { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateWithAudit(id: string, data: Partial<UserAttributes>, auditData: any): Promise<User | null> {
    return tracer.startActiveSpan('repository.User.updateWithAudit', async (span: Span) => {
      const transaction = await User.sequelize!.transaction();
      
      try {
        span.setAttribute('id', id);
        
        const user = await this.findById(id, { transaction });
        if (!user) {
          throw new Error('User not found');
        }
        const oldValue = user.toJSON() as UserAttributes;
        
        // Update user
        await user.update(data, { transaction });
        
        // Get changes
        const changes = Object.keys(data)
          .filter(key => user.get(key as keyof UserAttributes) !== oldValue[key as keyof UserAttributes])
          .map(key => ({
            field: key,
            oldValue: oldValue[key as keyof UserAttributes],
            newValue: (data as any)[key]
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
        logger.info(`User updated with audit: ${id}`);
        return user;
      } catch (error) {
        await transaction.rollback();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error updating user with audit: ${id}`, { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateLoginInfo(id: string, ipAddress?: string): Promise<void> {
    return tracer.startActiveSpan('repository.User.updateLoginInfo', async (span: Span) => {
      try {
        span.setAttribute('id', id);
        await this.model.update(
          {
            lastLogin: new Date(),
            loginAttempts: 0,
            lockUntil: null
          },
          { where: { id } }
        );
        logger.info(`User login info updated: ${id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error updating user login info: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    return tracer.startActiveSpan('repository.User.incrementLoginAttempts', async (span: Span) => {
      try {
        span.setAttribute('id', id);
        await this.model.update(
          {
            loginAttempts: this.model.sequelize!.literal('loginAttempts + 1'),
            lockUntil: this.model.sequelize!.literal('CASE WHEN loginAttempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE) ELSE lockUntil END')
          },
          { where: { id } }
        );
        logger.warn(`User login attempts incremented: ${id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error incrementing user login attempts: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findByType(userType: UserType, options?: FindOptions): Promise<User[]> {
    return tracer.startActiveSpan('repository.User.findByType', async (span: Span) => {
      try {
        span.setAttribute('userType', userType);
        const users = await this.findAll({
          where: { userType },
          ...options
        });
        span.setAttribute('count', users.length);
        return users;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error finding users by type: ${userType}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findPendingVerifications(): Promise<User[]> {
    return tracer.startActiveSpan('repository.User.findPendingVerifications', async (span: Span) => {
      try {
        const users = await this.findAll({
          where: {
            status: UserStatus.PENDING_VERIFICATION,
            userType: {
              [Op.in]: [UserType.SCOUT, UserType.ADVERTISER]
            }
          },
          order: [['createdAt', 'ASC']]
        });
        span.setAttribute('count', users.length);
        return users;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error finding pending verifications', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async verifyUser(id: string, verificationData: any): Promise<void> {
    return tracer.startActiveSpan('repository.User.verifyUser', async (span: Span) => {
      const transaction = await User.sequelize!.transaction();
      
      try {
        span.setAttribute('id', id);
        
        const user = await this.findById(id, { transaction });
        if (!user) {
          throw new Error('User not found');
        }
        const oldValue = user.toJSON() as UserAttributes;
        
        await user.update(
          {
            status: UserStatus.ACTIVE,
            emailVerified: true,
            verificationToken: null,
            verificationTokenExpires: null,
            ...verificationData
          },
          { transaction }
        );

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
            { field: 'status', oldValue: oldValue.status, newValue: UserStatus.ACTIVE },
            { field: 'emailVerified', oldValue: oldValue.emailVerified, newValue: true }
          ],
          ipAddress: verificationData.ipAddress,
          userAgent: verificationData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`User verified: ${id}`);
      } catch (error) {
        await transaction.rollback();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error verifying user: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async searchUsers(query: string, options?: FindOptions): Promise<User[]> {
    return tracer.startActiveSpan('repository.User.searchUsers', async (span: Span) => {
      try {
        span.setAttribute('query', query);
        
        const users = await this.findAll({
          where: {
            [Op.or]: [
              { email: { [Op.like]: `%${query}%` } },
              { firstName: { [Op.like]: `%${query}%` } },
              { lastName: { [Op.like]: `%${query}%` } }
            ]
          },
          ...options
        });
        span.setAttribute('count', users.length);
        return users;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error(`Error searching users: ${query}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getDashboardStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    byType: Record<string, number>;
  }> {
    return tracer.startActiveSpan('repository.User.getDashboardStats', async (span: Span) => {
      try {
        const [total, active, pending, byType] = await Promise.all([
          this.count(),
          this.count({ where: { status: UserStatus.ACTIVE } }),
          this.count({ where: { status: UserStatus.PENDING_VERIFICATION } }),
          this.model.findAll({
            attributes: ['userType', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
            group: ['userType']
          })
        ]);

        const byTypeMap = (byType as any[]).reduce((acc, item) => {
          acc[item.userType] = parseInt(item.get('count'));
          return acc;
        }, {} as Record<string, number>);

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
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setStatus({ code: 2, message: errorMessage });
        logger.error('Error getting user dashboard stats', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}