import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { structuredLogger } from '../utils';
import { getCookieOptions } from '@config/cookIeOptions';
import { AuthServiceLoginResponse, AuthUser, ResendVerificationRespnseDto, SignUpResponseDto } from 'src/types/auth.types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * User registration endpoint
   * @api POST /auth/register
   * @apiName API-AUTH-001
   * @apiGroup Authentication
   * @srsRequirement REQ-AUTH-01
   */
  async signupAdvertiser(req: Request, res: Response, next: NextFunction): Promise<void> {


    try {
      console.log(req.body)
      const response = await this.authService.signupAdvertiser(req.body)

      res.status(201).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async signupAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {


    try {
      console.log(req.body)
      const response = await this.authService.createAdmin(req.body)

      res.status(201).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async createSportsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.createSportsAdmin(req.body)
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }


  /**
   * User login endpoint
   * @api POST /auth/login
   * @apiName API-AUTH-002
   * @apiGroup Authentication
   * @srsRequirement REQ-AUTH-02
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const result = await this.authService.login({ email, password })

      if ('refreshToken' in result && 'accessToken' in result) {
        const verified = result as AuthServiceLoginResponse


        const cookieOptions = getCookieOptions()
        console.log('Setting refresh token cookie with options:', cookieOptions)
        const clearOptions = { ...getCookieOptions() };


        res.clearCookie('refreshToken', clearOptions as any);
        res.cookie('refreshToken', verified.refreshToken, cookieOptions as any)





        res.status(200).json({
          user: verified.user,
          accessToken: verified.accessToken,
        })
      } else {
        res.status(200).json(result as SignUpResponseDto)
      }
    } catch (error) {
      console.error(error)
      next(error)
    }
  }


  /**
   * User logout endpoint
   * @api POST /auth/logout
   * @apiName API-AUTH-003
   * @apiGroup Authentication
   * @srsRequirement REQ-AUTH-02
   * @remarks Logout is often handled on client-side by destroying token,
   * but we provide endpoint for strict cookie clearing or blacklist logic if needed
   */


  async resendCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { verificationToken, id } = req.body
      const newToken = await this.authService.generateNewCode(verificationToken)
      res.json({ verificationToken: newToken, id } as ResendVerificationRespnseDto)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body
      if (!email) {
        res.status(400).json({ message: 'Email is required' })
        return
      }

      await this.authService.forgotPassword(email)
      res.status(200).end()
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const user = await this.authService.getMe(userId)
      res.status(200).json(user as AuthUser)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }


  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.verifyEmail(req.body)
      const cookieOptions = getCookieOptions()
      console.log('Setting refresh token cookie with options:', cookieOptions)
      const clearOptions = { ...getCookieOptions() };


      res.clearCookie('refreshToken', clearOptions as any);
      res.cookie('refreshToken', result.refreshToken, cookieOptions as any)
      res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.resetPassword(req.body)
      const cookieOptions = getCookieOptions()
      console.log('Setting refresh token cookie with options:', cookieOptions)
      const clearOptions = { ...getCookieOptions() };


      res.clearCookie('refreshToken', clearOptions as any);
      res.cookie('refreshToken', result.refreshToken, cookieOptions as any)

      res.status(200).json({
        user: {
          id: result.user.id,
          role: result.user.role,
          username: result.user.username,
        },
        accessToken: result.accessToken,
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('All cookies received:', req.cookies)
      console.log('Headers:', req.headers.cookie)

      const cookieHeader = req.headers.cookie
      if (!cookieHeader) {
        res.status(401).json({ message: 'No cookies provided' })
        return
      }

      const refreshToken = cookieHeader
        .split(';')
        .find(cookie => cookie.trim().startsWith('refreshToken='))
        ?.split('=')[1]

      if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token found in cookies' })
        return
      }

      const accessToken = await this.authService.refreshToken(refreshToken)
      res.status(200).json(accessToken)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }


  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        path: '/',
      })
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}