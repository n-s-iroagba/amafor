import { UserRepository } from '../repositories/UserRepository';
import { AuditService } from './AuditService';
import User, { UserCreationAttributes } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export class AuthService {
  private userRepository: UserRepository;
  private auditService: AuditService;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditService = new AuditService();
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateToken(payload: { id: string; email: string; role: string[] }): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  public async register(data: UserCreationAttributes, ipAddress: string): Promise<{ user: User; token: string }> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const passwordHash = await this.hashPassword(data.passwordHash);

      const newUser = await this.userRepository.create({
        ...data,
        passwordHash,
        status: 'pending_verification' as any,
        roles: ['user']
      });

      const token = this.generateToken({
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

      logger.info('User registered', { userId: newUser.id, email: newUser.email });

      return { user: newUser, token };
    } catch (error: any) {
      logger.error('Registration failed', { error: error.message, email: data.email });
      throw error;
    }
  }

  public async login(email: string, password: string, ipAddress: string): Promise<{ user: User; token: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await this.verifyPassword(password, user.passwordHash);
      if (!isValid) {
        logger.warn('Login failed - bad password', { userId: user.id, email });
        throw new Error('Invalid credentials');
      }

      if (user.status === 'suspended') {
        logger.warn('Login blocked - suspended', { userId: user.id, email });
        throw new Error('Account suspended');
      }

      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.roles
      });

      logger.info('Login success', { userId: user.id });

      await this.userRepository.update(user.id, { lastLogin: new Date() });

      return { user, token };
    } catch (error: any) {
      logger.error('Login failed', { error: error.message });
      throw error;
    }
  }
}