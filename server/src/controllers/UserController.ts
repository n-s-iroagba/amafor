import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get current user profile
   * @api GET /users/profile
   * @apiName API-USER-001
   * @apiGroup Users
   * @srsRequirement REQ-AUTH-02
   */
  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const user = await this.userService.getUserProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   * @api PATCH /users/profile
   * @apiName API-USER-002
   * @apiGroup Users
   * @srsRequirement REQ-AUTH-02
   */
  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const updatedUser = await this.userService.updateUserProfile(userId, req.body);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify user account (Admin only)
   * @api PATCH /users/:userId/verify
   * @apiName API-USER-003
   * @apiGroup Users
   * @srsRequirement REQ-ADM-06, REQ-ADM-11
   */
  public verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = (req as any).user.id;
      const { userId } = req.params;
      const { status } = req.body; // 'APPROVED' | 'REJECTED'

      const user = await this.userService.verifyUser(adminId, userId, status);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };
}