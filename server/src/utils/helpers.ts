import { Request } from 'express';
import { logger } from './logger';
import { tracer } from './tracer';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique ID
export const generateId = (): string => {
  return uuidv4();
};

// Get client IP address from request
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection.remoteAddress || 'unknown';
};

// Get user agent from request
export const getUserAgent = (req: Request): string => {
  return req.get('user-agent') || 'unknown';
};

// Get request ID from headers or generate new one
export const getRequestId = (req: Request): string => {
  return (req.headers['x-request-id'] as string) || generateId();
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date: Date | string, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };

  if (format === 'full') {
    options.weekday = 'long';
    options.hour = 'numeric';
    options.minute = 'numeric';
  }

  return dateObj.toLocaleDateString('en-NG', options);
};

// Format date-time
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  });
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: Date | string): number => {
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Calculate read time for content
export const calculateReadTime = (content: string, wordsPerMinute: number = 200): number => {
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime); // Minimum 1 minute
};

// Generate share URL
export const generateShareUrl = (type: 'whatsapp' | 'facebook' | 'twitter', url: string, text?: string): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text || 'Check this out!');

  switch (type) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    default:
      return url;
  }
};

// Generate WhatsApp contact URL
export const generateWhatsAppUrl = (phone: string, message?: string): string => {
  const encodedMessage = encodeURIComponent(message || 'Hello, I would like to get more information.');
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
};

// Generate article share message
export const generateArticleShareMessage = (title: string, url: string): string => {
  return `Check out this article from Amafor Gladiators FC: "${title}" ${url}`;
};

// Generate player share message
export const generatePlayerShareMessage = (playerName: string, position: string, url: string): string => {
  return `Check out ${playerName}, a ${position} from Amafor Gladiators FC: ${url}`;
};

// Slugify string
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - 3) + '...';
};

// Extract excerpt from content
export const extractExcerpt = (content: string, maxLength: number = 200): string => {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, ' ');

  // Collapse multiple spaces
  const collapsedText = plainText.replace(/\s+/g, ' ').trim();

  return truncateText(collapsedText, maxLength);
};

// Generate pagination metadata
export const generatePagination = (
  page: number,
  limit: number,
  total: number
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
} => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrevious,
    nextPage: hasNext ? page + 1 : null,
    previousPage: hasPrevious ? page - 1 : null,
  };
};

// Sort array by property
export const sortBy = <T>(array: T[], property: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    let aValue: any = a[property];
    let bValue: any = b[property];

    // Handle dates
    if (aValue instanceof Date && bValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }

    // Handle strings case-insensitive
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter array by multiple criteria
export const filterBy = <T>(
  array: T[],
  filters: Partial<Record<keyof T, any>>,
  operator: 'AND' | 'OR' = 'AND'
): T[] => {
  return array.filter(item => {
    if (operator === 'AND') {
      // All filters must match
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null) return true;

        const itemValue = item[key as keyof T];

        // Handle array values
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }

        // Handle regex
        if (value instanceof RegExp) {
          return value.test(String(itemValue));
        }

        // Handle exact match
        return itemValue === (value as any);
      });
    } else {
      // OR: At least one filter must match
      return Object.entries(filters).some(([key, value]) => {
        if (value === undefined || value === null) return false;

        const itemValue = item[key as keyof T];

        // Handle array values
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }

        // Handle regex
        if (value instanceof RegExp) {
          return value.test(String(itemValue));
        }

        // Handle exact match
        return itemValue === (value as any);
      });
    }
  });
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (obj instanceof Date) return new Date(obj.getTime()) as T;

  if (obj instanceof Array) {
    const arrCopy: any[] = [];
    obj.forEach((item, index) => {
      arrCopy[index] = deepClone(item);
    });
    return arrCopy as T;
  }

  if (typeof obj === 'object') {
    const objCopy: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      objCopy[key] = deepClone((obj as any)[key]);
    });
    return objCopy as T;
  }

  return obj;
};

// Merge objects deeply
export const deepMerge = (target: any, source: any): any => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
};

// Check if value is an object
export const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Generate random number in range
export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random string
export const randomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

// Parse boolean from string
export const parseBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
};

// Parse integer with default
export const parseIntWithDefault = (value: any, defaultValue: number): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Parse float with default
export const parseFloatWithDefault = (value: any, defaultValue: number): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Sleep/delay function
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function with exponential backoff
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  return tracer.startActiveSpan('helpers.retry', async (span) => {
    let lastError: Error = new Error('Retry failed');

    for (let i = 0; i < retries; i++) {
      try {
        span.setAttributes({
          'helpers.retry_attempt': i + 1,
          'helpers.max_retries': retries,
        });

        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (i < retries - 1) {
          const waitTime = delay * Math.pow(2, i); // Exponential backoff
          await sleep(waitTime);
        }
      }
    }

    span.setStatus({
      code: 2,
      message: lastError.message,
    });

    throw lastError;
  });
};

// Validate Nigerian phone number
export const validateNigerianPhone = (phone: string): boolean => {
  const regex = /^(\+234|0)[7-9][0-1]\d{8}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

// Format Nigerian phone number
export const formatNigerianPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');

  if (clean.startsWith('234')) {
    return `+${clean}`;
  } else if (clean.startsWith('0')) {
    return `+234${clean.substring(1)}`;
  }

  return phone;
};

// Generate OTP (One-Time Password)
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
};

// Mask sensitive data
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (!data || data.length <= visibleChars * 2) {
    return '*'.repeat(data?.length || 0);
  }

  const firstPart = data.substring(0, visibleChars);
  const lastPart = data.substring(data.length - visibleChars);
  const maskedPart = '*'.repeat(data.length - visibleChars * 2);

  return `${firstPart}${maskedPart}${lastPart}`;
};

// Get current timestamp
export const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Calculate percentage
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

// Round to decimal places
export const roundTo = (num: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

// Export all helpers
export default {
  generateId,
  getClientIp,
  getUserAgent,
  getRequestId,
  formatCurrency,
  formatDate,
  formatDateTime,
  calculateAge,
  calculateReadTime,
  generateShareUrl,
  generateWhatsAppUrl,
  generateArticleShareMessage,
  generatePlayerShareMessage,
  slugify,
  truncateText,
  extractExcerpt,
  generatePagination,
  sortBy,
  filterBy,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  isObject,
  randomInRange,
  randomString,
  parseBoolean,
  parseIntWithDefault,
  parseFloatWithDefault,
  sleep,
  retry,
  validateNigerianPhone,
  formatNigerianPhone,
  generateOTP,
  maskSensitiveData,
  getTimestamp,
  calculatePercentage,
  roundTo,
};