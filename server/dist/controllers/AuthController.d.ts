import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    private authService;
    constructor();
    /**
     * User registration endpoint
     * @api POST /auth/register
     * @apiName API-AUTH-001
     * @apiGroup Authentication
     * @srsRequirement REQ-AUTH-01
     */
    signupAdvertiser(req: Request, res: Response, next: NextFunction): Promise<void>;
    signupAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSportsAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * User login endpoint
     * @api POST /auth/login
     * @apiName API-AUTH-002
     * @apiGroup Authentication
     * @srsRequirement REQ-AUTH-02
     */
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * User logout endpoint
     * @api POST /auth/logout
     * @apiName API-AUTH-003
     * @apiGroup Authentication
     * @srsRequirement REQ-AUTH-02
     * @remarks Logout is often handled on client-side by destroying token,
     * but we provide endpoint for strict cookie clearing or blacklist logic if needed
     */
    resendCode(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map