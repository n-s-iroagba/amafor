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

        // Assuming user.roles is an array of strings
        const userRoles: string[] = user.roles || [];

        // If roles parameter is empty, any authenticated user can access
        if (roles.length > 0) {
            // Check if there is an intersection between allowed roles and user roles
            const isAuthorized = roles.some(role => userRoles.includes(role));

            if (!isAuthorized) {
                return res.status(403).json({ success: false, message: `User roles [${userRoles.join(', ')}] are not authorized to access this route` });
            }
        }

        next();
    };
};
