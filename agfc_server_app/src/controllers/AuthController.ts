import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { structuredLogger } from '../utils';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.authService.register(req.body, req.ip || '0.0.0.0');
      
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password, req.ip || '0.0.0.0');

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            roles: user.roles
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Logout is often handled on client-side by destroying token, 
  // but we provide endpoint for strict cookie clearing or blacklist logic if needed
  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      structuredLogger.security('LOGOUT', (req as any).user?.id, req.ip);
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };
}