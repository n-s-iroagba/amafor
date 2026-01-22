"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class AuthController {
    constructor() {
        /**
         * User registration endpoint
         * @api POST /auth/register
         * @apiName API-AUTH-001
         * @apiGroup Authentication
         * @srsRequirement REQ-AUTH-01
         */
        this.register = async (req, res, next) => {
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
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * User login endpoint
         * @api POST /auth/login
         * @apiName API-AUTH-002
         * @apiGroup Authentication
         * @srsRequirement REQ-AUTH-02
         */
        this.login = async (req, res, next) => {
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
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * User logout endpoint
         * @api POST /auth/logout
         * @apiName API-AUTH-003
         * @apiGroup Authentication
         * @srsRequirement REQ-AUTH-02
         * @remarks Logout is often handled on client-side by destroying token,
         * but we provide endpoint for strict cookie clearing or blacklist logic if needed
         */
        this.logout = async (req, res, next) => {
            try {
                utils_1.structuredLogger.security('LOGOUT', req.user?.id, req.ip);
                res.status(200).json({ success: true, message: 'Logged out successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new services_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map