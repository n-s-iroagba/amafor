"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = exports.generateRandomString = exports.checkPasswordStrength = exports.createRateLimiterKey = exports.sanitizeSqlInput = exports.validateCsrfToken = exports.generateCsrfToken = exports.hashApiKey = exports.generateApiKey = exports.generatePasswordResetToken = exports.generateVerificationToken = exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("./logger");
const tracer_1 = require("./tracer");
// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
// Password hashing
const hashPassword = async (password) => {
    return tracer_1.tracer.startActiveSpan('security.hashPassword', async (span) => {
        try {
            const salt = await bcrypt_1.default.genSalt(SALT_ROUNDS);
            const hash = await bcrypt_1.default.hash(password, salt);
            span.setAttributes({
                'security.salt_rounds': SALT_ROUNDS,
                'security.hash_length': hash.length,
            });
            return hash;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error hashing password', { error });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.hashPassword = hashPassword;
// Password verification
const verifyPassword = async (password, hash) => {
    return tracer_1.tracer.startActiveSpan('security.verifyPassword', async (span) => {
        try {
            const isValid = await bcrypt_1.default.compare(password, hash);
            span.setAttributes({
                'security.password_valid': isValid,
            });
            return isValid;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error verifying password', { error });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.verifyPassword = verifyPassword;
// Generate JWT token
const generateToken = (userId, userType, roles) => {
    return tracer_1.tracer.startActiveSpan('security.generateToken', (span) => {
        try {
            const payload = {
                sub: userId,
                type: userType,
                roles,
                iat: Math.floor(Date.now() / 1000),
            };
            const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
                issuer: 'amafor-gladiators-api',
                audience: 'amafor-gladiators-web',
            });
            span.setAttributes({
                'security.user_id': userId,
                'security.user_type': userType,
                'security.token_expires_in': JWT_EXPIRES_IN,
            });
            return token;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error generating JWT token', { error, userId });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.generateToken = generateToken;
// Generate refresh token
const generateRefreshToken = (userId) => {
    return tracer_1.tracer.startActiveSpan('security.generateRefreshToken', (span) => {
        try {
            const payload = {
                sub: userId,
                type: 'refresh',
                iat: Math.floor(Date.now() / 1000),
            };
            const token = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
                expiresIn: REFRESH_TOKEN_EXPIRES_IN,
                issuer: 'amafor-gladiators-api',
                audience: 'amafor-gladiators-web',
            });
            span.setAttributes({
                'security.user_id': userId,
                'security.refresh_token_expires_in': REFRESH_TOKEN_EXPIRES_IN,
            });
            return token;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error generating refresh token', { error, userId });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.generateRefreshToken = generateRefreshToken;
// Verify JWT token
const verifyToken = (token) => {
    return tracer_1.tracer.startActiveSpan('security.verifyToken', (span) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
                issuer: 'amafor-gladiators-api',
                audience: 'amafor-gladiators-web',
            });
            span.setAttributes({
                'security.token_valid': true,
                'security.user_id': decoded.sub,
            });
            return decoded;
        }
        catch (error) {
            span.setAttributes({
                'security.token_valid': false,
                'security.token_error': error.message,
            });
            logger_1.logger.warn('JWT token verification failed', { error: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.verifyToken = verifyToken;
// Verify refresh token
const verifyRefreshToken = (token) => {
    return tracer_1.tracer.startActiveSpan('security.verifyRefreshToken', (span) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, {
                issuer: 'amafor-gladiators-api',
                audience: 'amafor-gladiators-web',
            });
            span.setAttributes({
                'security.refresh_token_valid': true,
                'security.user_id': decoded.sub,
            });
            return decoded;
        }
        catch (error) {
            span.setAttributes({
                'security.refresh_token_valid': false,
                'security.refresh_token_error': error.message,
            });
            logger_1.logger.warn('Refresh token verification failed', { error: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
// Generate verification token
const generateVerificationToken = () => {
    return tracer_1.tracer.startActiveSpan('security.generateVerificationToken', (span) => {
        try {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setHours(expires.getHours() + 24); // 24 hours expiration
            span.setAttributes({
                'security.token_length': token.length,
                'security.token_expires': expires.toISOString(),
            });
            return { token, expires };
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error generating verification token', { error });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.generateVerificationToken = generateVerificationToken;
// Generate password reset token
const generatePasswordResetToken = () => {
    return tracer_1.tracer.startActiveSpan('security.generatePasswordResetToken', (span) => {
        try {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setHours(expires.getHours() + 1); // 1 hour expiration
            span.setAttributes({
                'security.reset_token_length': token.length,
                'security.reset_token_expires': expires.toISOString(),
            });
            return { token, expires };
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error generating password reset token', { error });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.generatePasswordResetToken = generatePasswordResetToken;
// Generate API key
const generateApiKey = () => {
    return tracer_1.tracer.startActiveSpan('security.generateApiKey', (span) => {
        try {
            const apiKey = crypto_1.default.randomBytes(32).toString('hex');
            const prefix = 'agfc_';
            const timestamp = Date.now().toString(36);
            const key = `${prefix}${apiKey}_${timestamp}`;
            span.setAttributes({
                'security.api_key_length': key.length,
                'security.api_key_prefix': prefix,
            });
            return key;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error generating API key', { error });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.generateApiKey = generateApiKey;
// Hash API key for storage
const hashApiKey = (apiKey) => {
    return tracer_1.tracer.startActiveSpan('security.hashApiKey', (span) => {
        try {
            const hash = crypto_1.default
                .createHash('sha256')
                .update(apiKey)
                .digest('hex');
            span.setAttributes({
                'security.api_key_hash_length': hash.length,
            });
            return hash;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error hashing API key', { error });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.hashApiKey = hashApiKey;
// Generate CSRF token
const generateCsrfToken = () => {
    return tracer_1.tracer.startActiveSpan('security.generateCsrfToken', (span) => {
        try {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            span.setAttributes({
                'security.csrf_token_length': token.length,
            });
            return token;
        }
        catch (error) {
            span.setStatus({
                code: 2,
                message: error.message,
            });
            logger_1.logger.error('Error generating CSRF token', { error });
            throw error;
        }
        finally {
            span.end();
        }
    });
};
exports.generateCsrfToken = generateCsrfToken;
// Validate CSRF token
const validateCsrfToken = (token, sessionToken) => {
    return tracer_1.tracer.startActiveSpan('security.validateCsrfToken', (span) => {
        try {
            const isValid = crypto_1.default.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken));
            span.setAttributes({
                'security.csrf_valid': isValid,
            });
            if (!isValid) {
                logger_1.logger.warn('CSRF token validation failed');
            }
            return isValid;
        }
        catch (error) {
            span.setAttributes({
                'security.csrf_valid': false,
                'security.csrf_error': error.message,
            });
            logger_1.logger.error('Error validating CSRF token', { error });
            return false;
        }
        finally {
            span.end();
        }
    });
};
exports.validateCsrfToken = validateCsrfToken;
// Sanitize user input for SQL injection prevention
const sanitizeSqlInput = (input) => {
    if (!input)
        return '';
    // Remove SQL keywords and special characters
    const sqlKeywords = [
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 'OR', 'AND',
        'WHERE', 'FROM', 'JOIN', 'HAVING', 'GROUP BY', 'ORDER BY', 'LIMIT',
        'OFFSET', 'VALUES', 'SET', 'INTO', 'CREATE', 'ALTER', 'TRUNCATE'
    ];
    let sanitized = input;
    sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        sanitized = sanitized.replace(regex, '');
    });
    // Remove special characters that could be used in SQL injection
    sanitized = sanitized.replace(/[;'"\\\-\-]/g, '');
    return sanitized.trim();
};
exports.sanitizeSqlInput = sanitizeSqlInput;
// Rate limiting helper
const createRateLimiterKey = (req) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userId = req.user?.id || 'anonymous';
    const endpoint = req.path;
    return `rate_limit:${ip}:${userId}:${endpoint}`;
};
exports.createRateLimiterKey = createRateLimiterKey;
// Check password strength
const checkPasswordStrength = (password) => {
    const suggestions = [];
    let score = 0;
    // Length check
    if (password.length >= 8)
        score += 1;
    if (password.length >= 12)
        score += 1;
    if (password.length < 8) {
        suggestions.push('Password should be at least 8 characters long');
    }
    // Contains lowercase
    if (/[a-z]/.test(password))
        score += 1;
    else
        suggestions.push('Add lowercase letters');
    // Contains uppercase
    if (/[A-Z]/.test(password))
        score += 1;
    else
        suggestions.push('Add uppercase letters');
    // Contains numbers
    if (/[0-9]/.test(password))
        score += 1;
    else
        suggestions.push('Add numbers');
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password))
        score += 1;
    else
        suggestions.push('Add special characters');
    // Determine strength
    let strength;
    if (score <= 2)
        strength = 'weak';
    else if (score <= 3)
        strength = 'medium';
    else if (score <= 5)
        strength = 'strong';
    else
        strength = 'very_strong';
    return { score, strength, suggestions };
};
exports.checkPasswordStrength = checkPasswordStrength;
// Generate secure random string
const generateRandomString = (length = 32) => {
    return crypto_1.default.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};
exports.generateRandomString = generateRandomString;
// Encrypt sensitive data (for things like API keys in config)
const encryptData = (data, secret = JWT_SECRET) => {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv('aes-256-gcm', Buffer.from(secret.padEnd(32, '0').slice(0, 32)), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};
exports.encryptData = encryptData;
// Decrypt sensitive data
const decryptData = (encryptedData, secret = JWT_SECRET) => {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', Buffer.from(secret.padEnd(32, '0').slice(0, 32)), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptData = decryptData;
// Export all security utilities
exports.default = {
    hashPassword: exports.hashPassword,
    verifyPassword: exports.verifyPassword,
    generateToken: exports.generateToken,
    generateRefreshToken: exports.generateRefreshToken,
    verifyToken: exports.verifyToken,
    verifyRefreshToken: exports.verifyRefreshToken,
    generateVerificationToken: exports.generateVerificationToken,
    generatePasswordResetToken: exports.generatePasswordResetToken,
    generateApiKey: exports.generateApiKey,
    hashApiKey: exports.hashApiKey,
    generateCsrfToken: exports.generateCsrfToken,
    validateCsrfToken: exports.validateCsrfToken,
    sanitizeSqlInput: exports.sanitizeSqlInput,
    createRateLimiterKey: exports.createRateLimiterKey,
    checkPasswordStrength: exports.checkPasswordStrength,
    generateRandomString: exports.generateRandomString,
    encryptData: exports.encryptData,
    decryptData: exports.decryptData,
};
//# sourceMappingURL=security.js.map