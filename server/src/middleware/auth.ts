import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserStatus } from '../models/User';

/**
 * Verifies the Bearer JWT and attaches the full User record to req.user.
 * Rejects suspended accounts.
 */
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

/**
 * Role-based authorization middleware (multi-role aware).
 *
 * Passes if the authenticated user holds AT LEAST ONE of the allowed roles.
 * If `roles` is empty, any authenticated user is granted access.
 *
 * @param roles - Array of UserRole values that are permitted to access the route.
 */
export const authorize = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as User | undefined;
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        if (roles.length === 0) {
            return next();
        }

        // user.roles is a UserRole[] — check for any intersection
        const userRoles: UserRole[] = Array.isArray(user.roles) ? user.roles : [];
        const isAuthorized = roles.some(role => userRoles.includes(role));

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: [${roles.join(', ')}]. Your roles: [${userRoles.join(', ')}]`,
            });
        }

        next();
    };
};

/**
 * Convenience middleware — restricts access to administrative system users only.
 * Incorporates all infrastructure, ops, and commercial administrative roles.
 */
export const requireAdmin = authorize([
    'admin',
    'sports_admin',
    'finance_officer',
    'it_security',
    'commercial_manager'
]);
