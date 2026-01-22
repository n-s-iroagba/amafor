"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret_key');
            const user = await User_1.User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            if (user.status === User_1.UserStatus.SUSPENDED) {
                return res.status(403).json({ success: false, message: 'User account is suspended' });
            }
            req.user = user;
            next();
        }
        catch (err) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        // Check if user has any of the required roles
        // Assuming user.roles is an array of strings or user.userType matches
        // This logic might need adjustment based on real role system
        const userRoles = user.roles || [];
        const hasRole = roles.some(role => userRoles.includes(role) || user.userType === role);
        if (!roles.includes('admin') && !hasRole) { // Admin bypass? Or checks?
            // Simplest check:
            if (!roles.some(role => userRoles.includes(role) || user.userType === role)) {
                return res.status(403).json({ success: false, message: `User role ${user.userType} is not authorized to access this route` });
            }
        }
        // Better logic:
        if (roles.length > 0 && !roles.some(role => userRoles.includes(role) || user.userType === role)) {
            return res.status(403).json({ success: false, message: `User role ${user.userType} is not authorized to access this route` });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map