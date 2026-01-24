import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request } from 'express';
import { logger } from './logger';
import { tracer } from './tracer';
import { UserType } from '@models/User';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  return tracer.startActiveSpan('security.hashPassword', async (span) => {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);

      span.setAttributes({
        'security.salt_rounds': SALT_ROUNDS,
        'security.hash_length': hash.length,
      });

      return hash;
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error hashing password', { error });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Password verification
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return tracer.startActiveSpan('security.verifyPassword', async (span) => {
    try {
      const isValid = await bcrypt.compare(password, hash);

      span.setAttributes({
        'security.password_valid': isValid,
      });

      return isValid;
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error verifying password', { error });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Generate JWT token
export const generateToken = (userId: string, userType: UserType, roles: string[]): string => {
  try {
    const payload = {
      sub: userId,
      type: userType,
      roles,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload as any, JWT_SECRET as any, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'amafor-gladiators-api',
      audience: 'amafor-gladiators-web',
    } as any);

    return token;
  } catch (error: any) {
    logger.error('Error generating JWT token', { error, userId });
    throw error;
  }
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  try {
    const payload = {
      sub: userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload as any, JWT_REFRESH_SECRET as any, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      issuer: 'amafor-gladiators-api',
      audience: 'amafor-gladiators-web',
    } as any);

    return token;
  } catch (error: any) {
    logger.error('Error generating refresh token', { error, userId });
    throw error;
  }
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'amafor-gladiators-api',
      audience: 'amafor-gladiators-web',
    });

    return decoded;
  } catch (error: any) {
    logger.warn('JWT token verification failed', { error: error.message });
    throw error;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'amafor-gladiators-api',
      audience: 'amafor-gladiators-web',
    });

    return decoded;
  } catch (error: any) {
    logger.warn('Refresh token verification failed', { error: error.message });
    throw error;
  }
};

// Generate verification token
export const generateVerificationToken = (): { token: string; expires: Date } => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours expiration

    return { token, expires };
  } catch (error: any) {
    logger.error('Error generating verification token', { error });
    throw error;
  }
};

// Generate password reset token
export const generatePasswordResetToken = (): { token: string; expires: Date } => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiration

    return { token, expires };
  } catch (error: any) {
    logger.error('Error generating password reset token', { error });
    throw error;
  }
};

// Generate API key
export const generateApiKey = (): string => {
  try {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const prefix = 'agfc_';
    const timestamp = Date.now().toString(36);

    const key = `${prefix}${apiKey}_${timestamp}`;

    return key;
  } catch (error: any) {
    logger.error('Error generating API key', { error });
    throw error;
  }
};

// Hash API key for storage
export const hashApiKey = (apiKey: string): string => {
  try {
    const hash = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    return hash;
  } catch (error: any) {
    logger.error('Error hashing API key', { error });
    throw error;
  }
};

// Generate CSRF token
export const generateCsrfToken = (): string => {
  try {
    const token = crypto.randomBytes(32).toString('hex');

    return token;
  } catch (error: any) {
    logger.error('Error generating CSRF token', { error });
    throw error;
  }
};

// Validate CSRF token
export const validateCsrfToken = (token: string, sessionToken: string): boolean => {
  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(sessionToken)
    );

    if (!isValid) {
      logger.warn('CSRF token validation failed');
    }

    return isValid;
  } catch (error: any) {
    logger.error('Error validating CSRF token', { error });
    return false;
  }
};

// Sanitize user input for SQL injection prevention
export const sanitizeSqlInput = (input: string): string => {
  if (!input) return '';

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

// Rate limiting helper
export const createRateLimiterKey = (req: Request): string => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userId = (req as any).user?.id || 'anonymous';
  const endpoint = req.path;

  return `rate_limit:${ip}:${userId}:${endpoint}`;
};

// Check password strength
export const checkPasswordStrength = (password: string): {
  score: number;
  strength: 'weak' | 'medium' | 'strong' | 'very_strong';
  suggestions: string[];
} => {
  const suggestions: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length < 8) {
    suggestions.push('Password should be at least 8 characters long');
  }

  // Contains lowercase
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('Add lowercase letters');

  // Contains uppercase
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('Add uppercase letters');

  // Contains numbers
  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push('Add numbers');

  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else suggestions.push('Add special characters');

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' | 'very_strong';
  if (score <= 2) strength = 'weak';
  else if (score <= 3) strength = 'medium';
  else if (score <= 5) strength = 'strong';
  else strength = 'very_strong';

  return { score, strength, suggestions };
};

// Generate secure random string
export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Encrypt sensitive data (for things like API keys in config)
export const encryptData = (data: string, secret: string = JWT_SECRET): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret.padEnd(32, '0').slice(0, 32)), iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};

// Decrypt sensitive data
export const decryptData = (encryptedData: string, secret: string = JWT_SECRET): string => {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secret.padEnd(32, '0').slice(0, 32)), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Export all security utilities
export default {
  hashPassword,
  verifyPassword,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  generateApiKey,
  hashApiKey,
  generateCsrfToken,
  validateCsrfToken,
  sanitizeSqlInput,
  createRateLimiterKey,
  checkPasswordStrength,
  generateRandomString,
  encryptData,
  decryptData,
};