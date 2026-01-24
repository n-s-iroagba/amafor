"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundTo = exports.calculatePercentage = exports.getTimestamp = exports.maskSensitiveData = exports.generateOTP = exports.formatNigerianPhone = exports.validateNigerianPhone = exports.retry = exports.sleep = exports.parseFloatWithDefault = exports.parseIntWithDefault = exports.parseBoolean = exports.randomString = exports.randomInRange = exports.isObject = exports.deepMerge = exports.deepClone = exports.throttle = exports.debounce = exports.filterBy = exports.sortBy = exports.generatePagination = exports.extractExcerpt = exports.truncateText = exports.slugify = exports.generateWhatsAppUrl = exports.generateShareUrl = exports.calculateReadTime = exports.calculateAge = exports.formatDateTime = exports.formatDate = exports.formatCurrency = exports.getRequestId = exports.getUserAgent = exports.getClientIp = exports.generateId = void 0;
const tracer_1 = require("./tracer");
const uuid_1 = require("uuid");
// Generate a unique ID
const generateId = () => {
    return (0, uuid_1.v4)();
};
exports.generateId = generateId;
// Get client IP address from request
const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.connection.remoteAddress || 'unknown';
};
exports.getClientIp = getClientIp;
// Get user agent from request
const getUserAgent = (req) => {
    return req.get('user-agent') || 'unknown';
};
exports.getUserAgent = getUserAgent;
// Get request ID from headers or generate new one
const getRequestId = (req) => {
    return req.headers['x-request-id'] || (0, exports.generateId)();
};
exports.getRequestId = getRequestId;
// Format currency
const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
// Format date
const formatDate = (date, format = 'medium') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options = {
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
exports.formatDate = formatDate;
// Format date-time
const formatDateTime = (date) => {
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
exports.formatDateTime = formatDateTime;
// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
    const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
exports.calculateAge = calculateAge;
// Calculate read time for content
const calculateReadTime = (content, wordsPerMinute = 200) => {
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, readTime); // Minimum 1 minute
};
exports.calculateReadTime = calculateReadTime;
// Generate share URL
const generateShareUrl = (type, url, text) => {
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
exports.generateShareUrl = generateShareUrl;
// Generate WhatsApp contact URL
const generateWhatsAppUrl = (phone, message) => {
    const encodedMessage = encodeURIComponent(message || 'Hello, I would like to get more information.');
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
};
exports.generateWhatsAppUrl = generateWhatsAppUrl;
// Slugify string
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
};
exports.slugify = slugify;
// Truncate text with ellipsis
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - 3) + '...';
};
exports.truncateText = truncateText;
// Extract excerpt from content
const extractExcerpt = (content, maxLength = 200) => {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, ' ');
    // Collapse multiple spaces
    const collapsedText = plainText.replace(/\s+/g, ' ').trim();
    return (0, exports.truncateText)(collapsedText, maxLength);
};
exports.extractExcerpt = extractExcerpt;
// Generate pagination metadata
const generatePagination = (page, limit, total) => {
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
exports.generatePagination = generatePagination;
// Sort array by property
const sortBy = (array, property, order = 'asc') => {
    return [...array].sort((a, b) => {
        let aValue = a[property];
        let bValue = b[property];
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
        if (aValue < bValue)
            return order === 'asc' ? -1 : 1;
        if (aValue > bValue)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
};
exports.sortBy = sortBy;
// Filter array by multiple criteria
const filterBy = (array, filters, operator = 'AND') => {
    return array.filter(item => {
        if (operator === 'AND') {
            // All filters must match
            return Object.entries(filters).every(([key, value]) => {
                if (value === undefined || value === null)
                    return true;
                const itemValue = item[key];
                // Handle array values
                if (Array.isArray(value)) {
                    return value.includes(itemValue);
                }
                // Handle regex
                if (value instanceof RegExp) {
                    return value.test(String(itemValue));
                }
                // Handle exact match
                return itemValue === value;
            });
        }
        else {
            // OR: At least one filter must match
            return Object.entries(filters).some(([key, value]) => {
                if (value === undefined || value === null)
                    return false;
                const itemValue = item[key];
                // Handle array values
                if (Array.isArray(value)) {
                    return value.includes(itemValue);
                }
                // Handle regex
                if (value instanceof RegExp) {
                    return value.test(String(itemValue));
                }
                // Handle exact match
                return itemValue === value;
            });
        }
    });
};
exports.filterBy = filterBy;
// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
exports.debounce = debounce;
// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};
exports.throttle = throttle;
// Deep clone object
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array) {
        const arrCopy = [];
        obj.forEach((item, index) => {
            arrCopy[index] = (0, exports.deepClone)(item);
        });
        return arrCopy;
    }
    if (typeof obj === 'object') {
        const objCopy = {};
        Object.keys(obj).forEach(key => {
            objCopy[key] = (0, exports.deepClone)(obj[key]);
        });
        return objCopy;
    }
    return obj;
};
exports.deepClone = deepClone;
// Merge objects deeply
const deepMerge = (target, source) => {
    const output = { ...target };
    if ((0, exports.isObject)(target) && (0, exports.isObject)(source)) {
        Object.keys(source).forEach(key => {
            if ((0, exports.isObject)(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                }
                else {
                    output[key] = (0, exports.deepMerge)(target[key], source[key]);
                }
            }
            else {
                output[key] = source[key];
            }
        });
    }
    return output;
};
exports.deepMerge = deepMerge;
// Check if value is an object
const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};
exports.isObject = isObject;
// Generate random number in range
const randomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.randomInRange = randomInRange;
// Generate random string
const randomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.randomString = randomString;
// Parse boolean from string
const parseBoolean = (value) => {
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
};
exports.parseBoolean = parseBoolean;
// Parse integer with default
const parseIntWithDefault = (value, defaultValue) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};
exports.parseIntWithDefault = parseIntWithDefault;
// Parse float with default
const parseFloatWithDefault = (value, defaultValue) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
};
exports.parseFloatWithDefault = parseFloatWithDefault;
// Sleep/delay function
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
// Retry function with exponential backoff
const retry = async (fn, retries = 3, delay = 1000) => {
    return tracer_1.tracer.startActiveSpan('helpers.retry', async (span) => {
        let lastError = new Error('Retry failed');
        for (let i = 0; i < retries; i++) {
            try {
                span.setAttributes({
                    'helpers.retry_attempt': i + 1,
                    'helpers.max_retries': retries,
                });
                return await fn();
            }
            catch (error) {
                lastError = error;
                if (i < retries - 1) {
                    const waitTime = delay * Math.pow(2, i); // Exponential backoff
                    await (0, exports.sleep)(waitTime);
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
exports.retry = retry;
// Validate Nigerian phone number
const validateNigerianPhone = (phone) => {
    const regex = /^(\+234|0)[7-9][0-1]\d{8}$/;
    return regex.test(phone.replace(/\s/g, ''));
};
exports.validateNigerianPhone = validateNigerianPhone;
// Format Nigerian phone number
const formatNigerianPhone = (phone) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith('234')) {
        return `+${clean}`;
    }
    else if (clean.startsWith('0')) {
        return `+234${clean.substring(1)}`;
    }
    return phone;
};
exports.formatNigerianPhone = formatNigerianPhone;
// Generate OTP (One-Time Password)
const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
};
exports.generateOTP = generateOTP;
// Mask sensitive data
const maskSensitiveData = (data, visibleChars = 4) => {
    if (!data || data.length <= visibleChars * 2) {
        return '*'.repeat(data?.length || 0);
    }
    const firstPart = data.substring(0, visibleChars);
    const lastPart = data.substring(data.length - visibleChars);
    const maskedPart = '*'.repeat(data.length - visibleChars * 2);
    return `${firstPart}${maskedPart}${lastPart}`;
};
exports.maskSensitiveData = maskSensitiveData;
// Get current timestamp
const getTimestamp = () => {
    return new Date().toISOString();
};
exports.getTimestamp = getTimestamp;
// Calculate percentage
const calculatePercentage = (part, total) => {
    if (total === 0)
        return 0;
    return (part / total) * 100;
};
exports.calculatePercentage = calculatePercentage;
// Round to decimal places
const roundTo = (num, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
};
exports.roundTo = roundTo;
// Export all helpers
exports.default = {
    generateId: exports.generateId,
    getClientIp: exports.getClientIp,
    getUserAgent: exports.getUserAgent,
    getRequestId: exports.getRequestId,
    formatCurrency: exports.formatCurrency,
    formatDate: exports.formatDate,
    formatDateTime: exports.formatDateTime,
    calculateAge: exports.calculateAge,
    calculateReadTime: exports.calculateReadTime,
    generateShareUrl: exports.generateShareUrl,
    truncateText: exports.truncateText,
    extractExcerpt: exports.extractExcerpt,
    generatePagination: exports.generatePagination,
    sortBy: exports.sortBy,
    filterBy: exports.filterBy,
    debounce: exports.debounce,
    throttle: exports.throttle,
    deepClone: exports.deepClone,
    deepMerge: exports.deepMerge,
    isObject: exports.isObject,
    randomInRange: exports.randomInRange,
    randomString: exports.randomString,
    parseBoolean: exports.parseBoolean,
    parseIntWithDefault: exports.parseIntWithDefault,
    parseFloatWithDefault: exports.parseFloatWithDefault,
    sleep: exports.sleep,
    retry: exports.retry,
    validateNigerianPhone: exports.validateNigerianPhone,
    formatNigerianPhone: exports.formatNigerianPhone,
    generateOTP: exports.generateOTP,
    maskSensitiveData: exports.maskSensitiveData,
    getTimestamp: exports.getTimestamp,
    calculatePercentage: exports.calculatePercentage,
    roundTo: exports.roundTo,
};
//# sourceMappingURL=helpers.js.map