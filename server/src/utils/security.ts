import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { tracer } from './tracer';
import { UserType, UserStatus } from '@models/User';

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
      span.setStatus({
        code: 2,
        message: error.message,
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
      span.setStatus({
        code: 2,
        message: error.message,
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
  return tracer.startActiveSpan('security.generateToken', (span) => {
    try {
      const payload = {
        sub: userId,
        type: userType,
        roles,
        iat: Math.floor(Date.now() / 1000),
      };

      const token = jwt.sign(payload, JWT_SECRET, {
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
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error generating JWT token', { error, userId });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return tracer.startActiveSpan('security.generateRefreshToken', (span) => {
    try {
      const payload = {
        sub: userId,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
      };

      const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        issuer: 'amafor-gladiators-api',
        audience: 'amafor-gladiators-web',
      });

      span.setAttributes({
        'security.user_id': userId,
        'security.refresh_token_expires_in': REFRESH_TOKEN_EXPIRES_IN,
      });

      return token;
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error generating refresh token', { error, userId });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  return tracer.startActiveSpan('security.verifyToken', (span) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'amafor-gladiators-api',
        audience: 'amafor-gladiators-web',
      });

      span.setAttributes({
        'security.token_valid': true,
        'security.user_id': (decoded as any).sub,
      });

      return decoded;
    } catch (error) {
      span.setAttributes({
        'security.token_valid': false,
        'security.token_error': error.message,
      });

      logger.warn('JWT token verification failed', { error: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  return tracer.startActiveSpan('security.verifyRefreshToken', (span) => {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'amafor-gladiators-api',
        audience: 'amafor-gladiators-web',
      });

      span.setAttributes({
        'security.refresh_token_valid': true,
        'security.user_id': (decoded as any).sub,
      });

      return decoded;
    } catch (error) {
      span.setAttributes({
        'security.refresh_token_valid': false,
        'security.refresh_token_error': error.message,
      });

      logger.warn('Refresh token verification failed', { error: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Generate verification token
export const generateVerificationToken = (): { token: string; expires: Date } => {
  return tracer.startActiveSpan('security.generateVerificationToken', (span) => {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // 24 hours expiration

      span.setAttributes({
        'security.token_length': token.length,
        'security.token_expires': expires.toISOString(),
      });

      return { token, expires };
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error generating verification token', { error });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Generate password reset token
export const generatePasswordResetToken = (): { token: string; expires: Date } => {
  return tracer.startActiveSpan('security.generatePasswordResetToken', (span) => {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 1 hour expiration

      span.setAttributes({
        'security.reset_token_length': token.length,
        'security.reset_token_expires': expires.toISOString(),
      });

      return { token, expires };
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error generating password reset token', { error });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Generate API key
export const generateApiKey = (): string => {
  return tracer.startActiveSpan('security.generateApiKey', (span) => {
    try {
      const apiKey = crypto.randomBytes(32).toString('hex');
      const prefix = 'agfc_';
      const timestamp = Date.now().toString(36);
      
      const key = `${prefix}${apiKey}_${timestamp}`;

      span.setAttributes({
        'security.api_key_length': key.length,
        'security.api_key_prefix': prefix,
      });

      return key;
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error generating API key', { error });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Hash API key for storage
export const hashApiKey = (apiKey: string): string => {
  return tracer.startActiveSpan('security.hashApiKey', (span) => {
    try {
      const hash = crypto
        .createHash('sha256')
        .update(apiKey)
        .digest('hex');

      span.setAttributes({
        'security.api_key_hash_length': hash.length,
      });

      return hash;
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error hashing API key', { error });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Generate CSRF token
export const generateCsrfToken = (): string => {
  return tracer.startActiveSpan('security.generateCsrfToken', (span) => {
    try {
      const token = crypto.randomBytes(32).toString('hex');

      span.setAttributes({
        'security.csrf_token_length': token.length,
      });

      return token;
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error generating CSRF token', { error });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Validate CSRF token
export const validateCsrfToken = (token: string, sessionToken: string): boolean => {
  return tracer.startActiveSpan('security.validateCsrfToken', (span) => {
    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(sessionToken)
      );

      span.setAttributes({
        'security.csrf_valid': isValid,
      });

      if (!isValid) {
        logger.warn('CSRF token validation failed');
      }

      return isValid;
    } catch (error) {
      span.setAttributes({
        'security.csrf_valid': false,
        'security.csrf_error': error.message,
      });

      logger.error('Error validating CSRF token', { error });
      return false;
    } finally {
      span.end();
    }
  });
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