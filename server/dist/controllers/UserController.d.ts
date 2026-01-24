import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    private userService;
    constructor();
    /**
     * Get current user profile
     * @api GET /users/profile
     * @apiName API-USER-001
     * @apiGroup Users
     * @srsRequirement REQ-AUTH-02
     */
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update user profile
     * @api PATCH /users/profile
     * @apiName API-USER-002
     * @apiGroup Users
     * @srsRequirement REQ-AUTH-02
     */
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Verify user account (Admin only)
     * @api PATCH /users/:userId/verify
     * @apiName API-USER-003
     * @apiGroup Users
     * @srsRequirement REQ-ADM-06, REQ-ADM-11
     */
    verifyUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get pending advertisers
     * @api GET /users/pending-advertisers
     * @apiName API-USER-004
     * @apiGroup Users
     * @srsRequirement REQ-ADM-06
     */
    getPendingAdvertisers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map