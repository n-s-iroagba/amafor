// services/verification.service.ts


import { CodeHelper } from '../utils/codeHelper'
import User from '../models/User'
import logger from '../utils/logger'
import { TokenService } from './TokenService'
import { BadRequestError, ForbiddenError } from '../utils/errors'
import { AuthConfig } from '../types/auth.types'

import config from '../config'
import { UserService } from './user.service'
import EmailService from './EmailService'

export class VerificationService {
  
    private readonly tokenService: TokenService
    private readonly userService: UserService
    private readonly emailService: EmailService
    private readonly config: AuthConfig
    constructor(
      
  ) {

    this.emailService = new EmailService('');
    this.tokenService = new TokenService('aba','',)
    this.userService = new UserService()
    this.config = {jwtSecret:'a',clientUrl:process.env.NODE_ENV==='production'?'https://www.palmwebtv.com':'http://localhost:5000',tokenExpiration:{
      verification: 0,
      login: 0,
      refresh: 0
    }}
  }

  async intiateEmailVerificationProcess(
    user: User
  ): Promise<{ verificationToken: string; id: number }> {
    try {
      const verificationToken = this.tokenService.generateEmailVerificationToken(user)

      const verificationCode = config.nodeEnv === 'production' ? CodeHelper.generateVerificationCode() : '123456'
      console.log(verificationCode,verificationToken)

      user.verificationCode = verificationCode
      user.verificationToken = verificationToken
      await user.save()
      await this.emailService.sendVerificationEmail(user)

      logger.info('Verification details generated successfully', { userId: user.id })
      return { verificationToken, id: user.id }
    } catch (error) {
      logger.error('Error generating verification details', { userId: user.id, error })
      throw error
    }
  }

  async regenerateVerificationCode(token: string): Promise<string> {
    try {
      const user = await this.userService.findUserByVerificationToken(token)
      const verificationToken = this.tokenService.generateEmailVerificationToken(user)
      if (user.verificationToken !== token) throw new BadRequestError('Token does not match')
          const verificationCode =
        config.nodeEnv === 'production' ? CodeHelper.generateVerificationCode() : '123456'
      console.log('VVVV', verificationCode)

      user.verificationCode = verificationCode
      user.verificationToken = verificationToken
      await user.save()
 
      await this.emailService.sendVerificationEmail(user)

      logger.info('Verification code regenerated', { userId: user.id })
      return verificationToken
    } catch (error) {
      logger.error('Error regenerating verification code', { error })
      throw error
    }
  }

  validateVerificationCode(user: User, code: string): void {
    console.log(user)
    if (user.verificationCode !== code) {
      logger.warn('Invalid verification code provided', { userId: user.id })
      throw new ForbiddenError('Invalid verification code', 'INVALID_VERIFICATION_CODE')
    }
    logger.info('Verification code validated successfully', { userId: user.id })
  }
}