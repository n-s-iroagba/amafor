import { UserRepository } from '../repositories';
import { AuditService } from './AuditService';
import { User, UserCreationAttributes } from '../models';
import { structuredLogger, tracer, security } from '../utils';

export class AuthService {
  private userRepository: UserRepository;
  private auditService: AuditService;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditService = new AuditService();
  }

  public async register(data: UserCreationAttributes, ipAddress: string): Promise<{ user: User; token: string }> {
    return tracer.startActiveSpan('service.AuthService.register', async (span) => {
      try {
        const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
        if (existingUser) {
          throw new Error('Email already registered');
        }

        const passwordHash = await security.hashPassword(data.passwordHash);
        
        const newUser = await this.userRepository.create({
          ...data,
          passwordHash,
          status: 'PENDING_VERIFICATION',
          roles: ['user']
        });

        const token = security.generateToken({ 
          id: newUser.id, 
          email: newUser.email, 
          role: newUser.roles 
        });

        // 1. Audit Log (DB + File)
        await this.auditService.logAction({
          userId: newUser.id,
          userEmail: newUser.email,
          userType: newUser.userType || 'user',
          action: 'CREATE',
          entityType: 'USER',
          entityId: newUser.id,
          entityName: newUser.email,
          changes: [],
          ipAddress,
          metadata: { event: 'registration' }
        });

        // 2. Specific Security Log
        structuredLogger.security('USER_REGISTERED', newUser.id, ipAddress, { email: newUser.email });

        return { user: newUser, token };
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Registration failed', { error: error.message, email: data.email });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async login(email: string, password: string, ipAddress: string): Promise<{ user: User; token: string }> {
    return tracer.startActiveSpan('service.AuthService.login', async (span) => {
      try {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValid = await security.verifyPassword(password, user.passwordHash);
        if (!isValid) {
          structuredLogger.security('LOGIN_FAILED', user.id, ipAddress, { email, reason: 'Bad Password' });
          throw new Error('Invalid credentials');
        }

        if (user.status === 'SUSPENDED') {
          structuredLogger.security('LOGIN_BLOCKED', user.id, ipAddress, { email, reason: 'Suspended' });
          throw new Error('Account suspended');
        }

        const token = security.generateToken({ 
          id: user.id, 
          email: user.email, 
          role: user.roles 
        });

        structuredLogger.security('LOGIN_SUCCESS', user.id, ipAddress);

        await this.userRepository.update(user.id, { lastLogin: new Date() });

        return { user, token };
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}