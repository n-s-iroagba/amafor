import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStatus } from '../models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { id: string };
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            if (user.status === UserStatus.SUSPENDED) {
                return res.status(403).json({ success: false, message: 'User account is suspended' });
            }

            (req as any).user = user;
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
    } catch (error) {
        next(error);
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
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
