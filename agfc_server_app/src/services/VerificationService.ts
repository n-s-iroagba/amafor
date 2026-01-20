// services/verification.service.ts
import User from '../models/User';
import logger from '../utils/logger';
import { TokenService } from './TokenService';

import EmailService from './EmailService';
import { BadRequestError, ForbiddenError } from '@utils/errors';

// Helper to generate verification codes
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface AuthConfig {
  jwtSecret: string;
  clientUrl: string;
  tokenExpiration: {
    verification: number;
    login: number;
    refresh: number;
  };
}

export class VerificationService {
  private readonly tokenService: TokenService;
  private readonly emailService: EmailService;
  private readonly config: AuthConfig;

  constructor() {
    this.emailService = new EmailService('');
    this.tokenService = new TokenService('aba', '');
    this.config = {
      jwtSecret: 'a',
      clientUrl: process.env.NODE_ENV === 'production' ? 'https://www.palmwebtv.com' : 'http://localhost:5000',
      tokenExpiration: {
        verification: 0,
        login: 0,
        refresh: 0
      }
    };
  }

  async initiateEmailVerificationProcess(
    user: User
  ): Promise<{ verificationToken: string; id: string }> {
    try {
      const verificationToken = this.tokenService.generateEmailVerificationToken(user);
      const verificationCode = process.env.NODE_ENV === 'production' ? generateVerificationCode() : '123456';

      console.log(verificationCode, verificationToken);

      // Store verification token (the User model uses verificationToken, not verificationCode)
      user.verificationToken = verificationToken;
      await user.save();
      await this.emailService.sendVerificationEmail(user);

      logger.info('Verification details generated successfully', { userId: user.id });
      return { verificationToken, id: user.id };
    } catch (error) {
      logger.error('Error generating verification details', { userId: user.id, error });
      throw error;
    }
  }

  async regenerateVerificationCode(token: string): Promise<string> {
    try {
      const user = await User.findOne({ where: { verificationToken: token } });
      if (!user) {
        throw new BadRequestError('User not found with this verification token');
      }

      const verificationToken = this.tokenService.generateEmailVerificationToken(user);
      if (user.verificationToken !== token) {
        throw new BadRequestError('Token does not match');
      }

      const verificationCode = process.env.NODE_ENV === 'production' ? generateVerificationCode() : '123456';
      console.log('VVVV', verificationCode);

      user.verificationToken = verificationToken;
      await user.save();

      await this.emailService.sendVerificationEmail(user);

      logger.info('Verification code regenerated', { userId: user.id });
      return verificationToken;
    } catch (error) {
      logger.error('Error regenerating verification code', { error });
      throw error;
    }
  }

  validateVerificationCode(user: User, token: string): void {
    console.log(user);
    if (user.verificationToken !== token) {
      logger.warn('Invalid verification token provided', { userId: user.id });
      throw new ForbiddenError('Invalid verification token', 'INVALID_VERIFICATION_TOKEN');
    }
    logger.info('Verification token validated successfully', { userId: user.id });
  }
}