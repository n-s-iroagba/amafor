"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../services");
const cookIeOptions_1 = require("@config/cookIeOptions");
class AuthController {
    constructor() {
        this.authService = new services_1.AuthService();
    }
    /**
     * User registration endpoint
     * @api POST /auth/register
     * @apiName API-AUTH-001
     * @apiGroup Authentication
     * @srsRequirement REQ-AUTH-01
     */
    async signupAdvertiser(req, res, next) {
        try {
            console.log(req.body);
            const response = await this.authService.signupAdvertiser(req.body);
            res.status(201).json(response);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async signupAdmin(req, res, next) {
        try {
            console.log(req.body);
            const response = await this.authService.createAdmin(req.body);
            res.status(201).json(response);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async createSportsAdmin(req, res, next) {
        try {
            const result = await this.authService.createSportsAdmin(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    /**
     * User login endpoint
     * @api POST /auth/login
     * @apiName API-AUTH-002
     * @apiGroup Authentication
     * @srsRequirement REQ-AUTH-02
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }
            const result = await this.authService.login({ email, password });
            if ('refreshToken' in result && 'accessToken' in result) {
                const verified = result;
                const cookieOptions = (0, cookIeOptions_1.getCookieOptions)();
                console.log('Setting refresh token cookie with options:', cookieOptions);
                const clearOptions = { ...(0, cookIeOptions_1.getCookieOptions)() };
                res.clearCookie('refreshToken', clearOptions);
                res.cookie('refreshToken', verified.refreshToken, cookieOptions);
                res.status(200).json({
                    user: verified.user,
                    accessToken: verified.accessToken,
                });
            }
            else {
                res.status(200).json(result);
            }
        }
        catch (error) {
            console.error(error);
            next(error);
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
    async resendCode(req, res, next) {
        try {
            const { verificationToken, id } = req.body;
            const newToken = await this.authService.generateNewCode(verificationToken);
            res.json({ verificationToken: newToken, id });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ message: 'Email is required' });
                return;
            }
            await this.authService.forgotPassword(email);
            res.status(200).end();
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const user = await this.authService.getMe(userId);
            res.status(200).json(user);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const result = await this.authService.verifyEmail(req.body);
            const cookieOptions = (0, cookIeOptions_1.getCookieOptions)();
            console.log('Setting refresh token cookie with options:', cookieOptions);
            const clearOptions = { ...(0, cookIeOptions_1.getCookieOptions)() };
            res.clearCookie('refreshToken', clearOptions);
            res.cookie('refreshToken', result.refreshToken, cookieOptions);
            res.status(200).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const result = await this.authService.resetPassword(req.body);
            const cookieOptions = (0, cookIeOptions_1.getCookieOptions)();
            console.log('Setting refresh token cookie with options:', cookieOptions);
            const clearOptions = { ...(0, cookIeOptions_1.getCookieOptions)() };
            res.clearCookie('refreshToken', clearOptions);
            res.cookie('refreshToken', result.refreshToken, cookieOptions);
            res.status(200).json({
                user: {
                    id: result.user.id,
                    role: result.user.role,
                    username: result.user.username,
                },
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            console.log('All cookies received:', req.cookies);
            console.log('Headers:', req.headers.cookie);
            const cookieHeader = req.headers.cookie;
            if (!cookieHeader) {
                res.status(401).json({ message: 'No cookies provided' });
                return;
            }
            const refreshToken = cookieHeader
                .split(';')
                .find(cookie => cookie.trim().startsWith('refreshToken='))
                ?.split('=')[1];
            if (!refreshToken) {
                res.status(401).json({ message: 'No refresh token found in cookies' });
                return;
            }
            const accessToken = await this.authService.refreshToken(refreshToken);
            res.status(200).json(accessToken);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const isProduction = process.env.NODE_ENV === 'production';
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
                path: '/',
            });
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map