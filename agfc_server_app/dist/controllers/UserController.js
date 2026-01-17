"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
class UserController {
    constructor() {
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
        this.userService = new services_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map