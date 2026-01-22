import { UserRepository } from '../repositories/UserRepository';
import { AuditService } from './AuditService';
import User, { UserCreationAttributes } from '../models/User';
import { AuditAction, EntityType } from '../models/AuditLog';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';
import { SignUpResponseDto, AuthServiceLoginResponse } from '../types/auth.types';

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
        action: AuditAction.CREATE,
        entityType: EntityType.USER,
        entityId: newUser.id,
        entityName: newUser.email,
        changes: [],
        ipAddress,
        metadata: { event: 'registration' },
        timestamp: new Date()
      });

      logger.info('User registered', { userId: newUser.id, email: newUser.email });

      return { user: newUser, token };
    } catch (error: any) {
      logger.error('Registration failed', { error: error.message, email: data.email });
      throw error;
    }
  }

  public async login(data: { email: string; password: string }): Promise<AuthServiceLoginResponse | SignUpResponseDto> {
    const { email, password } = data;
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isValid = await this.verifyPassword(password, user.passwordHash);
      if (!isValid) {
        logger.warn('Login failed - bad password', { userId: user.id, email });
        throw new AppError('Invalid credentials', 401);
      }

      if (user.status === 'suspended') {
        logger.warn('Login blocked - suspended', { userId: user.id, email });
        throw new AppError('Account suspended', 403);
      }

      if (user.status === 'pending_verification') {
        return { verificationToken: 'pending_token' } as SignUpResponseDto; // Simplified
      }

      const accessToken = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.roles
      });
      const refreshToken = this.generateToken({ id: user.id, email: user.email, role: user.roles }); // Should be longer expiry

      logger.info('Login success', { userId: user.id });

      await this.userRepository.update(user.id, { lastLogin: new Date() });

      return {
        user: { id: user.id, username: user.email, role: user.roles[0] } as any,
        accessToken,
        refreshToken
      };
    } catch (error: any) {
      logger.error('Login failed', { error: error.message });
      throw error;
    }
  }

  public async signupAdvertiser(data: any): Promise<SignUpResponseDto> {
    // Stub
    return { verificationToken: 'stub_token' };
  }

  public async createAdmin(data: any): Promise<SignUpResponseDto> {
    // Stub
    return { verificationToken: 'stub_token' };
  }

  public async createSportsAdmin(data: any): Promise<SignUpResponseDto> {
    // Stub
    return { verificationToken: 'stub_token' };
  }

  public async generateNewCode(token: string): Promise<string> {
    return 'new_code';
  }

  public async forgotPassword(email: string): Promise<void> {
    // Stub
  }

  public async getMe(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return { id: user.id, username: user.email, role: user.roles[0] };
  }

  public async verifyEmail(data: any): Promise<AuthServiceLoginResponse> {
    // Stub
    return {
      user: { id: '1' as any, username: 'user', role: 'user' as any },
      accessToken: 'token',
      refreshToken: 'refresh'
    };
  }

  public async resetPassword(data: any): Promise<AuthServiceLoginResponse> {
    // Stub
    return {
      user: { id: '1' as any, username: 'user', role: 'user' as any },
      accessToken: 'token',
      refreshToken: 'refresh'
    };
  }

  public async refreshToken(token: string): Promise<{ accessToken: string }> {
    return { accessToken: 'new_access_token' };
  }
}