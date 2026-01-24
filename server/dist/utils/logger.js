"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.structuredLogger = exports.errorLogger = exports.requestLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const uuid_1 = require("uuid");
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.metadata());
// Create logger instance
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'amafor-gladiators-api' },
    transports: [
        // Write all logs with importance level of 'error' or less to error.log
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs with importance level of 'info' or less to combined.log
        new winston_1.default.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});
// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
    }));
}
// Request logging middleware
const requestLogger = (req, res, next) => {
    const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
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
        userId: req.user?.id,
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
            userId: req.user?.id,
        });
    });
    next();
};
exports.requestLogger = requestLogger;
// Error logging middleware
const errorLogger = (error, req) => {
    const requestId = req?.headers['x-request-id'] || 'unknown';
    logger.error('Unhandled error', {
        requestId,
        error: error.message,
        stack: error.stack,
        url: req?.url,
        method: req?.method,
        userId: req?.user?.id,
    });
};
exports.errorLogger = errorLogger;
// Structured logging methods
exports.structuredLogger = {
    info: (message, meta) => {
        logger.info(message, meta);
    },
    error: (message, meta) => {
        logger.error(message, meta);
    },
    warn: (message, meta) => {
        logger.warn(message, meta);
    },
    debug: (message, meta) => {
        logger.debug(message, meta);
    },
    audit: (action, userId, entityType, entityId, details) => {
        logger.info('Audit log', {
            action,
            userId,
            entityType,
            entityId,
            ...details,
            timestamp: new Date().toISOString()
        });
    },
    security: (event, userId, ipAddress, details) => {
        logger.warn('Security event', {
            event,
            userId,
            ipAddress,
            ...details,
            timestamp: new Date().toISOString()
        });
    },
    business: (event, amount, userId, details) => {
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
exports.default = logger;
//# sourceMappingURL=logger.js.map