import crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import { AuditService } from './AuditService';
import User, { UserCreationAttributes, UserStatus, UserRole } from '../models/User';
import Advertiser from '../models/Advertiser';
import { AuditAction, EntityType } from '../models/AuditLog';
import logger from '../utils/logger';
import { AppError, BadRequestError, NotFoundError } from '../utils/errors';
import {
  SignUpRequestDto,
  SignUpResponseDto,
  AuthServiceLoginResponse,
  VerifyEmailRequestDto,
  AuthUser,
  ResetPasswordRequestDto,
} from '../types/auth.types';
import { VerificationService } from './VerificationService';
import { PasswordService } from './PasswordService';
import { TokenService } from './TokenService';
import { UserService } from './UserService';
import EmailService from './EmailService';

export class AuthService {
  private userRepository: UserRepository;
  private auditService: AuditService;
  private verificationService: VerificationService
  private tokenService: TokenService
  private passwordService: PasswordService
  private emailService: EmailService
  private userService: UserService

  constructor() {
    this.userRepository = new UserRepository();
    this.auditService = new AuditService();
    this.tokenService = new TokenService();
    this.passwordService = new PasswordService();
    this.verificationService = new VerificationService();
    this.userService = new UserService();
    this.emailService = new EmailService('');
  }

  public async hashPassword(password: string): Promise<string> {
    return this.passwordService.hashPassword(password);
  }

  /**
   * Invites a new admin/scout user.
   * Account is created but requires email verification on first login.
   * A temporary password is set; the invited user should reset it after verification.
   */
  public async inviteUser(data: { email: string; role: UserRole; firstName?: string; lastName?: string }): Promise<SignUpResponseDto> {
    try {
      logger.info('User invite started', { email: data.email, role: data.role });

      const existing = await this.userRepository.findOne({ where: { email: data.email } });
      if (existing) throw new BadRequestError('An account with this email already exists');

      // Generate a secure temporary password — invited user must reset it
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const passwordHash = await this.passwordService.hashPassword(tempPassword);

      const user = await this.userRepository.create({
        email: data.email,
        passwordHash,
        firstName: data.firstName ?? data.email.split('@')[0],
        lastName: data.lastName ?? '',
        role: data.role,
        status: UserStatus.PENDING_VERIFICATION,
        emailVerified: false,
        metadata: { invited: true, tempPassword: true },
      } as UserCreationAttributes);

      // Trigger the same verification email flow as signupAdvertiser
      const { verificationToken, id } = await this.verificationService.initiateEmailVerificationProcess(user);

      await this.auditService.logAction({
        userId: user.id,
        userEmail: user.email,
        userType: user.role,
        action: AuditAction.CREATE,
        entityType: EntityType.USER,
        entityId: user.id,
        entityName: user.email,
        changes: [],
        ipAddress: '0.0.0.0',
        metadata: { event: 'user_invite', role: data.role },
        timestamp: new Date(),
      });

      logger.info('User invite sent', { userId: user.id, email: user.email, role: data.role });

      return { verificationToken, id };
    } catch (error: any) {
      logger.error('User invite failed', { error: error.message, email: data.email });
      throw error;
    }
  }

  /**
   * Registers a new advertiser account.
   * Creates a User row and an Advertiser profile row, then sends a verification email.
   * Returns a verificationToken the client uses to poll /verify-email.
   */
  public async signupAdvertiser(data: SignUpRequestDto): Promise<SignUpResponseDto> {
    try {
      console.log('--- AUTH SERVICE: signupAdvertiser STARTED ---')
      logger.info('Advertiser signup started', { email: data.email });

      // 1. Duplicate check
      console.log('--- AUTH SERVICE: Checking for duplicates ---')
      const existing = await this.userRepository.findOne({ where: { email: data.email } });
      if (existing) {
        console.log('--- AUTH SERVICE: Duplicate found! Throwing BadRequestError... ---')
        throw new BadRequestError('An account with this email already exists');
      }
      console.log('--- AUTH SERVICE: Duplicate check passed ---')

      // 2. Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new BadRequestError('Passwords do not match');
      }

      // 3. Hash password
      const passwordHash = await this.passwordService.hashPassword(data.password);

      // 4. Derive firstName / lastName from contactName (e.g. "John Doe" → "John" + "Doe")
      const [firstName = '', ...rest] = (data.contactName ?? '').trim().split(' ');
      const lastName = rest.join(' ') || firstName;

      // 5. Create the User row
      const user = await this.userRepository.create({
        email: data.email,
        passwordHash,
        firstName,
        lastName,
        phone: data.contact_phone,
        role: 'advertiser' as UserRole,
        status: UserStatus.PENDING_VERIFICATION,
        emailVerified: false,
        metadata: {},
      } as UserCreationAttributes);

      // 6. Create the Advertiser profile row
      await Advertiser.create({
        companyName: data.companyName,
        contactPerson: data.contactName,
        email: data.contact_email || data.email,
        phone: data.contact_phone,
        status: 'active',
      });

      // 7. Send verification email and return token
      const { verificationToken, id } = await this.verificationService.initiateEmailVerificationProcess(user);

      // 8. Audit log
      await this.auditService.logAction({
        userId: user.id,
        userEmail: user.email,
        userType: user.role,
        action: AuditAction.CREATE,
        entityType: EntityType.USER,
        entityId: user.id,
        entityName: user.email,
        changes: [],
        ipAddress: '0.0.0.0',
        metadata: { event: 'advertiser_signup' },
        timestamp: new Date(),
      });

      logger.info('Advertiser signup completed', { userId: user.id, email: user.email });

      return { verificationToken, id };
    } catch (error: any) {
      logger.error('Advertiser signup failed', { error: error.message, email: data.email });
      throw error;
    }
  }

  /**
   * Login for all user types.
   * If email is unverified, re-triggers the verification flow instead.
   */
  public async login(data: { email: string; password: string }): Promise<AuthServiceLoginResponse | SignUpResponseDto> {
    const { email, password } = data;
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isValid = await this.passwordService.comparePasswords(password, user.passwordHash);
      if (!isValid) {
        logger.warn('Login failed - bad password', { userId: user.id, email });
        throw new AppError('Invalid credentials', 401);
      }

      if (user.status === UserStatus.SUSPENDED) {
        logger.warn('Login blocked - suspended', { userId: user.id, email });
        throw new AppError('Account suspended', 403);
      }

      if (!user.emailVerified) {
        logger.warn('Login attempted by unverified user', { userId: user.id });
        return await this.verificationService.initiateEmailVerificationProcess(user);
      }

      const { accessToken, refreshToken } = this.generateTokenPair(user);

      logger.info('Login success', { userId: user.id });

      await this.userRepository.update(user.id, { lastLogin: new Date() });

      return {
        user: {
          id: user.id,
          username: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
        } as AuthUser,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      logger.error('Login failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Issues a new access token from a refresh token.
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      logger.info('Token refresh attempted');

      const { decoded } = this.tokenService.verifyToken(refreshToken, 'refresh');

      const userId = decoded.sub;
      if (!userId) {
        logger.warn('Invalid refresh token - no user id in payload');
        throw new BadRequestError('Invalid refresh token');
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const newAccessToken = this.tokenService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role as any,
        permissions: [],
      });

      logger.info('Token refreshed successfully', { userId: user.id });
      return { accessToken: newAccessToken };
    } catch (error) {
      return this.handleAuthError('Token refresh', {}, error);
    }
  }

  /**
   * Verifies a user's email using a token and code.
   */
  async verifyEmail(data: VerifyEmailRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Email verification started');

      const user = await User.findOne({ where: { verificationToken: data.verificationToken } });

      if (!user) {
        logger.warn('Invalid verification token provided');
        throw new BadRequestError('Invalid or expired verification token');
      }

      this.verificationService.validateVerificationCode(user, data.verificationCode);

      // Mark as verified
      user.emailVerified = true;
      user.status = UserStatus.ACTIVE;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();

      const { accessToken, refreshToken } = this.generateTokenPair(user);
      logger.info('Email verification successful', { userId: user.id });

      const returnUser: AuthUser = {
        id: user.id,
        username: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
      };

      return { user: returnUser, accessToken, refreshToken };
    } catch (error) {
      return this.handleAuthError('Email verification', {}, error);
    }
  }

  /**
   * Generates a new email verification code.
   */
  async generateNewCode(token: string): Promise<string> {
    try {
      logger.info('New verification code generation requested');
      return await this.verificationService.regenerateVerificationCode(token);
    } catch (error) {
      return this.handleAuthError('New code generation', {}, error);
    }
  }

  /**
   * Sends a password reset email to the user.
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      logger.info('Password reset requested', { email });

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        // Don't reveal whether email exists
        logger.warn('Password reset for unknown email (silently ignored)', { email });
        return;
      }

      const { token, hashedToken } = this.passwordService.generateResetToken();

      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await this.userRepository.update(user.id, {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiry,
      });

      await this.emailService.sendPasswordResetEmail(user.email, token);

      logger.info('Password reset email sent', { userId: user.id });
    } catch (error) {
      return this.handleAuthError('Password reset', { email }, error);
    }
  }

  /**
   * Resets the user's password using the reset token.
   */
  async resetPassword(data: ResetPasswordRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Password reset process started');

      if (data.password !== data.confirmPassword) {
        throw new BadRequestError('Passwords do not match');
      }

      // Find user by hashed reset token
      const hashedToken = crypto.createHash('sha256').update(data.resetPasswordToken).digest('hex');
      const user = await this.userRepository.findOne({
        where: {
          passwordResetToken: hashedToken,
        },
      });

      if (!user) {
        throw new BadRequestError('Invalid or expired reset token');
      }

      if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
        throw new BadRequestError('Reset token has expired');
      }

      const hashedPassword = await this.passwordService.hashPassword(data.password);
      await this.userRepository.update(user.id, {
        passwordHash: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      });

      const { accessToken, refreshToken } = this.generateTokenPair(user);
      logger.info('Password reset successful', { userId: user.id });

      const returnUser: AuthUser = {
        id: user.id,
        username: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
      };

      return { user: returnUser, accessToken, refreshToken };
    } catch (error) {
      return this.handleAuthError('Password reset', {}, error);
    }
  }

  /**
   * Returns the current authenticated user's details.
   */
  async getMe(userId: string): Promise<AuthUser> {
    try {
      logger.info('Get current user requested', { userId });

      const user = await this.userRepository.findById(userId);
      if (!user) throw new NotFoundError('User not found');

      logger.info('Current user retrieved successfully', { userId });

      return {
        id: user.id,
        username: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
      };
    } catch (error) {
      return this.handleAuthError('Get current user', { userId }, error);
    }
  }

  // ─────────────────── helpers ───────────────────

  private generateTokenPair(user: User): { accessToken: string; refreshToken: string } {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role as any,
      permissions: [] as string[],
    };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  private async handleAuthError(operation: string, context: Record<string, any>, error: any): Promise<never> {
    logger.error(`${operation} failed`, { ...context, error });
    throw error;
  }
}