import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get current user's own profile.
   * @api GET /users/profile
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
   * Update the current user's own profile.
   * Roles and passwordHash are stripped inside UserService.updateUserProfile — users cannot
   * elevate their own privileges via this endpoint.
   * @api PATCH /users/profile
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
   * Admin-only: update any user (including role changes).
   * @api PUT /users/:id
   * @srsRequirement REQ-ADM-05
   */
  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = (req as any).user.id;
      const updatedUser = await this.userService.adminUpdateUser(id, req.body, adminId);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin-only: verify / change a user's status (active / suspended).
   * @api PATCH /users/:userId/verify
   * @srsRequirement REQ-ADM-06, REQ-ADM-11
   */
  public verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = (req as any).user.id;
      const { userId } = req.params;
      const { status } = req.body;
      const user = await this.userService.verifyUser(adminId, userId, status);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin-only: list pending advertisers awaiting verification.
   * @api GET /users/pending-advertisers
   * @srsRequirement REQ-ADM-06
   */
  public getPendingAdvertisers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getPendingAdvertisers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin-only: list all users.
   * @api GET /users
   * @srsRequirement REQ-ADM-05
   */
  public listUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers(req.query);
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin-only: get a single user by id.
   * @api GET /users/:id
   * @srsRequirement REQ-ADM-05
   */
  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin-only: create a user directly (no invite email).
   * @api POST /users
   * @srsRequirement REQ-ADM-05
   */
  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin-only: soft-delete a user.
   * @api DELETE /users/:id
   * @srsRequirement REQ-ADM-05
   */
  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = (req as any).user.id;
      await this.userService.deleteUser(id, adminId);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}