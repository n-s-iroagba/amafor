import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.metadata()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'amafor-gladiators-api' },
  transports: [
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of 'info' or less to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  const startTime = Date.now();

  // Store request ID for later use
  req.headers['x-request-id'] = requestId;

  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
  });

  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger.log(logLevel, 'Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
      userId: (req as any).user?.id,
    });
  });

  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req?: Request) => {
  const requestId = req?.headers['x-request-id'] as string || 'unknown';
  
  logger.error('Unhandled error', {
    requestId,
    error: error.message,
    stack: error.stack,
    url: req?.url,
    method: req?.method,
    userId: (req as any)?.user?.id,
  });
};

// Structured logging methods
export const structuredLogger = {
  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },
  
  error: (message: string, meta?: any) => {
    logger.error(message, meta);
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },
  
  audit: (action: string, userId: string, entityType: string, entityId: string, details?: any) => {
    logger.info('Audit log', {
      action,
      userId,
      entityType,
      entityId,
      ...details,
      timestamp: new Date().toISOString()
    });
  },
  
  security: (event: string, userId: string, ipAddress?: string, details?: any) => {
    logger.warn('Security event', {
      event,
      userId,
      ipAddress,
      ...details,
      timestamp: new Date().toISOString()
    });
  },
  
  business: (event: string, amount?: number, userId?: string, details?: any) => {
    logger.info('Business event', {
      event,
      amount,
      userId,
      ...details,
      timestamp: new Date().toISOString()
    });
  }
};

// Export default logger
export default logger;