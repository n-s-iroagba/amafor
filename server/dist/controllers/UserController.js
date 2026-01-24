"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
class UserController {
    constructor() {
        /**
         * Get current user profile
         * @api GET /users/profile
         * @apiName API-USER-001
         * @apiGroup Users
         * @srsRequirement REQ-AUTH-02
         */
        this.getProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const user = await this.userService.getUserProfile(userId);
                res.status(200).json({ success: true, data: user });
            }
            catch (error) {
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
        this.updateProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const updatedUser = await this.userService.updateUserProfile(userId, req.body);
                res.status(200).json({ success: true, data: updatedUser });
            }
            catch (error) {
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
        this.verifyUser = async (req, res, next) => {
            try {
                const adminId = req.user.id;
                const { userId } = req.params;
                const { status } = req.body; // 'APPROVED' | 'REJECTED'
                const user = await this.userService.verifyUser(adminId, userId, status);
                res.status(200).json({ success: true, data: user });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get pending advertisers
         * @api GET /users/pending-advertisers
         * @apiName API-USER-004
         * @apiGroup Users
         * @srsRequirement REQ-ADM-06
         */
        this.getPendingAdvertisers = async (req, res, next) => {
            try {
                const users = await this.userService.getPendingAdvertisers();
                res.status(200).json({ success: true, data: users });
            }
            catch (error) {
                next(error);
            }
        };
        this.listUsers = async (req, res, next) => {
            try {
                const users = await this.userService.getAllUsers(req.query);
                res.status(200).json({ success: true, data: users });
            }
            catch (error) {
                next(error);
            }
        };
        this.getUser = async (req, res, next) => {
            try {
                const { id } = req.params;
                const user = await this.userService.getUserById(id);
                res.status(200).json({ success: true, data: user });
            }
            catch (error) {
                next(error);
            }
        };
        this.createUser = async (req, res, next) => {
            try {
                const user = await this.userService.createUser(req.body);
                res.status(201).json({ success: true, data: user });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const { id } = req.params;
                const adminId = req.user.id;
                await this.userService.deleteUser(id, adminId);
                res.status(200).json({ success: true, message: 'User deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new services_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map