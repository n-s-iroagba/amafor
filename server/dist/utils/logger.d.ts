import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
declare const logger: winston.Logger;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorLogger: (error: Error, req?: Request) => void;
export declare const structuredLogger: {
    info: (message: string, meta?: any) => void;
    error: (message: string, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
    audit: (action: string, userId: string, entityType: string, entityId: string, details?: any) => void;
    security: (event: string, userId: string, ipAddress?: string, details?: any) => void;
    business: (event: string, amount?: number, userId?: string, details?: any) => void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map