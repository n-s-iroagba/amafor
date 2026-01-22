"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeObject = exports.sanitizeInput = exports.validateUrl = exports.validateEmail = exports.validateId = exports.validateFile = exports.validateAsync = exports.validate = exports.systemSchemas = exports.auditSchemas = exports.analyticsSchemas = exports.patronageSchemas = exports.donationSchemas = exports.advertisingSchemas = exports.fixtureSchemas = exports.articleSchemas = exports.playerSchemas = exports.userSchemas = exports.commonSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("./logger");
const tracer_1 = require("./tracer");
// Common validation schemas
exports.commonSchemas = {
    id: joi_1.default.string().uuid().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    phone: joi_1.default.string().pattern(/^\+?[\d\s\-\(\)]+$/),
    url: joi_1.default.string().uri(),
    date: joi_1.default.date().iso(),
    dateTime: joi_1.default.date().iso(),
    amount: joi_1.default.number().positive(),
    pagination: {
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(20),
    },
};
// User validation schemas
exports.userSchemas = {
    login: joi_1.default.object({
        email: exports.commonSchemas.email,
        password: exports.commonSchemas.password,
    }),
    register: joi_1.default.object({
        email: exports.commonSchemas.email,
        password: exports.commonSchemas.password,
        firstName: joi_1.default.string().min(2).max(100).required(),
        lastName: joi_1.default.string().min(2).max(100).required(),
        phone: exports.commonSchemas.phone,
    }),
    updateProfile: joi_1.default.object({
        firstName: joi_1.default.string().min(2).max(100),
        lastName: joi_1.default.string().min(2).max(100),
        phone: exports.commonSchemas.phone,
        avatarUrl: exports.commonSchemas.url,
    }),
    scoutRegistration: joi_1.default.object({
        email: exports.commonSchemas.email,
        password: exports.commonSchemas.password,
        firstName: joi_1.default.string().min(2).max(100).required(),
        lastName: joi_1.default.string().min(2).max(100).required(),
        organization: joi_1.default.string().min(2).max(200).required(),
        socialMediaUrl: exports.commonSchemas.url,
        reason: joi_1.default.string().min(10).max(1000).required(),
    }),
    advertiserRegistration: joi_1.default.object({
        email: exports.commonSchemas.email,
        password: exports.commonSchemas.password,
        businessName: joi_1.default.string().min(2).max(200).required(),
        phone: exports.commonSchemas.phone.required(),
        website: exports.commonSchemas.url,
    }),
    donorRegistration: joi_1.default.object({
        email: exports.commonSchemas.email,
        firstName: joi_1.default.string().min(2).max(100).required(),
        lastName: joi_1.default.string().min(2).max(100).required(),
        phone: exports.commonSchemas.phone,
        optInSupporterWall: joi_1.default.boolean().default(false),
    }),
    resetPassword: joi_1.default.object({
        password: exports.commonSchemas.password,
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required(),
    }),
};
// Player validation schemas
exports.playerSchemas = {
    create: joi_1.default.object({
        name: joi_1.default.string().min(2).max(200).required(),
        dateOfBirth: exports.commonSchemas.date.required(),
        position: joi_1.default.string().valid('GK', 'DF', 'MF', 'FW').required(),
        height: joi_1.default.number().positive().max(3),
        nationality: joi_1.default.string().max(100),
        biography: joi_1.default.string().max(5000),
        jerseyNumber: joi_1.default.number().integer().min(1).max(99),
        imageUrl: exports.commonSchemas.url,
    }),
    update: joi_1.default.object({
        name: joi_1.default.string().min(2).max(200),
        dateOfBirth: exports.commonSchemas.date,
        position: joi_1.default.string().valid('GK', 'DF', 'MF', 'FW'),
        height: joi_1.default.number().positive().max(3),
        nationality: joi_1.default.string().max(100),
        biography: joi_1.default.string().max(5000),
        jerseyNumber: joi_1.default.number().integer().min(1).max(99),
        imageUrl: exports.commonSchemas.url,
        status: joi_1.default.string().valid('active', 'injured', 'suspended', 'transferred'),
        contactInfo: joi_1.default.object({
            email: exports.commonSchemas.email,
            phone: exports.commonSchemas.phone,
            agentName: joi_1.default.string().max(200),
            agentContact: joi_1.default.string().max(200),
        }),
    }),
    filter: joi_1.default.object({
        position: joi_1.default.string().valid('GK', 'DF', 'MF', 'FW'),
        minAge: joi_1.default.number().integer().min(16).max(40),
        maxAge: joi_1.default.number().integer().min(16).max(40),
        search: joi_1.default.string(),
        sortBy: joi_1.default.string().valid('name', 'age', 'position').default('name'),
        sortOrder: joi_1.default.string().valid('asc', 'desc').default('asc'),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
};
// Article validation schemas
exports.articleSchemas = {
    create: joi_1.default.object({
        title: joi_1.default.string().min(5).max(500).required(),
        content: joi_1.default.string().min(50).required(),
        excerpt: joi_1.default.string().max(500),
        featuredImage: exports.commonSchemas.url,
        tags: joi_1.default.array().items(joi_1.default.string().valid('football_news', 'match_report', 'academy_update', 'player_spotlight', 'club_announcement')).default([]),
        videoUrl: exports.commonSchemas.url,
        status: joi_1.default.string().valid('draft', 'published').default('draft'),
        scheduledPublishAt: exports.commonSchemas.dateTime,
    }),
    update: joi_1.default.object({
        title: joi_1.default.string().min(5).max(500),
        content: joi_1.default.string().min(50),
        excerpt: joi_1.default.string().max(500),
        featuredImage: exports.commonSchemas.url,
        tags: joi_1.default.array().items(joi_1.default.string().valid('football_news', 'match_report', 'academy_update', 'player_spotlight', 'club_announcement')),
        videoUrl: exports.commonSchemas.url,
        status: joi_1.default.string().valid('draft', 'scheduled', 'published', 'archived'),
    }),
    filter: joi_1.default.object({
        tag: joi_1.default.string().valid('football_news', 'match_report', 'academy_update', 'player_spotlight', 'club_announcement'),
        author: joi_1.default.string(),
        dateFrom: exports.commonSchemas.date,
        dateTo: exports.commonSchemas.date,
        search: joi_1.default.string(),
        sortBy: joi_1.default.string().valid('publishedAt', 'updatedAt', 'views').default('publishedAt'),
        sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc'),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
};
// Fixture validation schemas
exports.fixtureSchemas = {
    create: joi_1.default.object({
        matchDate: exports.commonSchemas.dateTime.required(),
        homeTeam: joi_1.default.string().min(2).max(200).required(),
        awayTeam: joi_1.default.string().min(2).max(200).required(),
        competition: joi_1.default.string().min(2).max(200).required(),
        venue: joi_1.default.string().max(200),
        homeScore: joi_1.default.number().integer().min(0),
        awayScore: joi_1.default.number().integer().min(0),
        status: joi_1.default.string().valid('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled').default('scheduled'),
    }),
    update: joi_1.default.object({
        matchDate: exports.commonSchemas.dateTime,
        homeTeam: joi_1.default.string().min(2).max(200),
        awayTeam: joi_1.default.string().min(2).max(200),
        competition: joi_1.default.string().min(2).max(200),
        venue: joi_1.default.string().max(200),
        homeScore: joi_1.default.number().integer().min(0),
        awayScore: joi_1.default.number().integer().min(0),
        status: joi_1.default.string().valid('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled'),
        attendance: joi_1.default.number().integer().min(0),
        referee: joi_1.default.string().max(200),
    }),
    filter: joi_1.default.object({
        status: joi_1.default.string().valid('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled', 'upcoming', 'past', 'all'),
        dateFrom: exports.commonSchemas.date,
        dateTo: exports.commonSchemas.date,
        competition: joi_1.default.string(),
        search: joi_1.default.string(),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
    lineup: joi_1.default.object({
        formation: joi_1.default.string().required(),
        startingXI: joi_1.default.array().items(joi_1.default.object({
            playerId: joi_1.default.string().uuid().required(),
            name: joi_1.default.string().required(),
            position: joi_1.default.string().required(),
            shirtNumber: joi_1.default.number().integer().min(1).max(99),
        })).min(11).max(11),
        substitutes: joi_1.default.array().items(joi_1.default.object({
            playerId: joi_1.default.string().uuid().required(),
            name: joi_1.default.string().required(),
            position: joi_1.default.string().required(),
            shirtNumber: joi_1.default.number().integer().min(1).max(99),
        })).max(7),
        coach: joi_1.default.string(),
    }),
};
// Advertising validation schemas
exports.advertisingSchemas = {
    campaignCreate: joi_1.default.object({
        name: joi_1.default.string().min(2).max(200).required(),
        zone: joi_1.default.string().valid('homepage_banner', 'top_page_banner', 'sidebar', 'article_footer', 'mid_article').required(),
        creativeId: joi_1.default.string().uuid().required(),
        targetViews: joi_1.default.number().integer().min(1000).required(),
        targeting: joi_1.default.object({
            type: joi_1.default.string().valid('homepage', 'tags').default('homepage'),
            tags: joi_1.default.array().items(joi_1.default.string().valid('football_news', 'match_report', 'academy_update', 'player_spotlight', 'club_announcement')).default([]),
            devices: joi_1.default.array().items(joi_1.default.string().valid('desktop', 'tablet', 'mobile')).default(['desktop', 'tablet', 'mobile']),
        }).default({}),
        startDate: exports.commonSchemas.dateTime,
        endDate: exports.commonSchemas.dateTime,
    }),
    campaignUpdate: joi_1.default.object({
        name: joi_1.default.string().min(2).max(200),
        targeting: joi_1.default.object({
            type: joi_1.default.string().valid('homepage', 'tags'),
            tags: joi_1.default.array().items(joi_1.default.string().valid('football_news', 'match_report', 'academy_update', 'player_spotlight', 'club_announcement')),
            devices: joi_1.default.array().items(joi_1.default.string().valid('desktop', 'tablet', 'mobile')),
        }),
        status: joi_1.default.string().valid('active', 'paused'),
    }),
    campaignFilter: joi_1.default.object({
        status: joi_1.default.string().valid('draft', 'pending_payment', 'active', 'paused', 'completed', 'cancelled'),
        dateFrom: exports.commonSchemas.date,
        dateTo: exports.commonSchemas.date,
        search: joi_1.default.string(),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
    creativeUpload: joi_1.default.object({
        zone: joi_1.default.string().valid('homepage_banner', 'top_page_banner', 'sidebar', 'article_footer', 'mid_article').required(),
        campaignId: joi_1.default.string().uuid(),
    }),
    disputeCreate: joi_1.default.object({
        campaignId: joi_1.default.string().uuid().required(),
        subject: joi_1.default.string().min(5).max(200).required(),
        description: joi_1.default.string().min(10).max(5000).required(),
        attachments: joi_1.default.array().items(exports.commonSchemas.url),
    }),
    adViewEvent: joi_1.default.object({
        campaignId: joi_1.default.string().uuid().required(),
        userId: joi_1.default.string().required(),
        sessionId: joi_1.default.string().required(),
        viewportSize: joi_1.default.object({
            width: joi_1.default.number().integer().positive(),
            height: joi_1.default.number().integer().positive(),
        }),
        visibilityPercentage: joi_1.default.number().min(0).max(100),
        duration: joi_1.default.number().positive(),
        url: exports.commonSchemas.url,
        userAgent: joi_1.default.string(),
        ipAddress: joi_1.default.string().ip(),
        timestamp: exports.commonSchemas.dateTime,
    }),
};
// Donation validation schemas
exports.donationSchemas = {
    create: joi_1.default.object({
        amount: joi_1.default.number().positive().min(100).required(),
        email: exports.commonSchemas.email.required(),
        firstName: joi_1.default.string().min(2).max(100).required(),
        lastName: joi_1.default.string().min(2).max(100).required(),
        phone: exports.commonSchemas.phone,
        message: joi_1.default.string().max(500),
        optInSupporterWall: joi_1.default.boolean().default(false),
        anonymous: joi_1.default.boolean().default(false),
    }),
    filter: joi_1.default.object({
        status: joi_1.default.string().valid('pending', 'completed', 'failed', 'refunded'),
        dateFrom: exports.commonSchemas.date,
        dateTo: exports.commonSchemas.date,
        search: joi_1.default.string(),
        donorEmail: exports.commonSchemas.email,
        sortBy: joi_1.default.string().valid('amount', 'createdAt', 'completedAt').default('createdAt'),
        sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc'),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
};
// Patronage validation schemas
exports.patronageSchemas = {
    subscribe: joi_1.default.object({
        tier: joi_1.default.string().valid('sponsor_grand_patron', 'patron', 'supporter', 'advocate', 'legend').required(),
        frequency: joi_1.default.string().valid('monthly', 'yearly', 'lifetime').required(),
        portraitUrl: exports.commonSchemas.url,
        logoUrl: exports.commonSchemas.url,
        displayName: joi_1.default.string().min(2).max(200).required(),
        message: joi_1.default.string().max(500),
    }),
    update: joi_1.default.object({
        portraitUrl: exports.commonSchemas.url,
        logoUrl: exports.commonSchemas.url,
        displayName: joi_1.default.string().min(2).max(200),
        message: joi_1.default.string().max(500),
    }),
    filter: joi_1.default.object({
        tier: joi_1.default.string().valid('sponsor_grand_patron', 'patron', 'supporter', 'advocate', 'legend'),
        status: joi_1.default.string().valid('active', 'cancelled', 'expired', 'payment_failed'),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
    manualCreate: joi_1.default.object({
        name: joi_1.default.string().min(2).max(200).required(),
        tier: joi_1.default.string().valid('sponsor_grand_patron', 'patron', 'supporter', 'advocate', 'legend').required(),
        email: exports.commonSchemas.email,
        phone: exports.commonSchemas.phone,
        portraitUrl: exports.commonSchemas.url,
        logoUrl: exports.commonSchemas.url,
        displayName: joi_1.default.string().min(2).max(200),
        message: joi_1.default.string().max(500),
        commitmentAmount: joi_1.default.number().positive(),
        commitmentFrequency: joi_1.default.string().valid('monthly', 'yearly', 'lifetime', 'one_time'),
        isCorporate: joi_1.default.boolean().default(false),
    }),
};
// Analytics validation schemas
exports.analyticsSchemas = {
    dateRange: joi_1.default.object({
        dateFrom: exports.commonSchemas.date.required(),
        dateTo: exports.commonSchemas.date.required(),
    }),
    contentAnalytics: joi_1.default.object({
        contentId: joi_1.default.string().uuid(),
        contentType: joi_1.default.string().valid('article', 'video', 'player'),
        dateFrom: exports.commonSchemas.date.required(),
        dateTo: exports.commonSchemas.date.required(),
        granularity: joi_1.default.string().valid('daily', 'weekly', 'monthly').default('daily'),
    }),
    financialAnalytics: joi_1.default.object({
        dateFrom: exports.commonSchemas.date.required(),
        dateTo: exports.commonSchemas.date.required(),
        type: joi_1.default.string().valid('donations', 'advertising', 'patronage', 'all').default('all'),
    }),
    userEngagement: joi_1.default.object({
        dateFrom: exports.commonSchemas.date.required(),
        dateTo: exports.commonSchemas.date.required(),
        userType: joi_1.default.string().valid('fan', 'scout', 'advertiser', 'patron', 'donor'),
    }),
};
// Audit validation schemas
exports.auditSchemas = {
    filter: joi_1.default.object({
        entityType: joi_1.default.string().valid('user', 'player', 'article', 'fixture', 'campaign', 'donation', 'patron'),
        entityId: joi_1.default.string(),
        userId: joi_1.default.string().uuid(),
        action: joi_1.default.string().valid('create', 'update', 'delete', 'login', 'logout', 'payment'),
        dateFrom: exports.commonSchemas.dateTime,
        dateTo: exports.commonSchemas.dateTime,
        ipAddress: joi_1.default.string().ip(),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
    export: joi_1.default.object({
        format: joi_1.default.string().valid('csv', 'json').default('csv'),
        dateFrom: exports.commonSchemas.date.required(),
        dateTo: exports.commonSchemas.date.required(),
    }),
};
// System validation schemas
exports.systemSchemas = {
    configUpdate: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.any()),
    notificationFilter: joi_1.default.object({
        type: joi_1.default.string().valid('system', 'user', 'payment', 'content', 'security'),
        unreadOnly: joi_1.default.boolean().default(false),
        page: exports.commonSchemas.pagination.page,
        limit: exports.commonSchemas.pagination.limit,
    }),
    cookieConsent: joi_1.default.object({
        preference: joi_1.default.string().valid('accept', 'reject').required(),
        sessionId: joi_1.default.string(),
    }),
};
// Validation middleware
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        return tracer_1.tracer.startActiveSpan('validation.middleware', async (span) => {
            try {
                span.setAttributes({
                    'validation.schema': schema.describe().type,
                    'validation.property': property,
                    'validation.path': req.path,
                });
                const data = req[property];
                const { error, value } = schema.validate(data, {
                    abortEarly: false,
                    stripUnknown: true,
                });
                if (error) {
                    span.setAttributes({
                        'validation.error': true,
                        'validation.errors': error.details.length,
                    });
                    const errors = error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message,
                        type: detail.type,
                    }));
                    logger_1.logger.warn('Validation failed', {
                        path: req.path,
                        errors,
                        userId: req.user?.id,
                    });
                    return res.status(400).json({
                        error: 'Validation Error',
                        message: 'The request contains invalid data',
                        details: errors,
                    });
                }
                // Replace request data with validated data
                req[property] = value;
                span.setAttributes({
                    'validation.success': true,
                    'validation.fields': Object.keys(value).length,
                });
                next();
            }
            catch (validationError) {
                span.setStatus({
                    code: 2,
                    message: validationError.message,
                });
                logger_1.logger.error('Validation middleware error', {
                    error: validationError.message,
                    path: req.path,
                });
                return res.status(500).json({
                    error: 'Validation Error',
                    message: 'An error occurred during validation',
                });
            }
            finally {
                span.end();
            }
        });
    };
};
exports.validate = validate;
// Async validation helper
const validateAsync = async (data, schema) => {
    return tracer_1.tracer.startActiveSpan('validation.async', async (span) => {
        try {
            span.setAttributes({
                'validation.data_type': typeof data,
                'validation.schema': schema.describe().type,
            });
            const { error, value } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                const errors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    type: detail.type,
                }));
                span.setAttributes({
                    'validation.success': false,
                    'validation.errors': errors.length,
                });
                return { valid: false, errors };
            }
            span.setAttributes({
                'validation.success': true,
                'validation.fields': Object.keys(value).length,
            });
            return { valid: true, value };
        }
        catch (validationError) {
            span.setStatus({
                code: 2,
                message: validationError.message,
            });
            throw validationError;
        }
        finally {
            span.end();
        }
    });
};
exports.validateAsync = validateAsync;
// Validate file upload
const validateFile = (file, allowedTypes, maxSize) => {
    const errors = [];
    // Check file type
    const fileType = file.mimetype.split('/')[1];
    if (!allowedTypes.includes(fileType)) {
        errors.push(`File type ${fileType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        errors.push(`File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`);
    }
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
};
exports.validateFile = validateFile;
// Validate ID parameter
const validateId = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};
exports.validateId = validateId;
// Validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
// Validate URL format
const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
exports.validateUrl = validateUrl;
// Sanitize input
const sanitizeInput = (input) => {
    if (!input)
        return '';
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim() // Trim whitespace
        .substring(0, 10000); // Limit length
};
exports.sanitizeInput = sanitizeInput;
// Sanitize object
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object')
        return obj;
    const sanitized = Array.isArray(obj) ? [] : {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = (0, exports.sanitizeInput)(value);
        }
        else if (typeof value === 'object' && value !== null) {
            sanitized[key] = (0, exports.sanitizeObject)(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};
exports.sanitizeObject = sanitizeObject;
// Export all schemas
exports.default = {
    common: exports.commonSchemas,
    user: exports.userSchemas,
    player: exports.playerSchemas,
    article: exports.articleSchemas,
    fixture: exports.fixtureSchemas,
    advertising: exports.advertisingSchemas,
    donation: exports.donationSchemas,
    patronage: exports.patronageSchemas,
    analytics: exports.analyticsSchemas,
    audit: exports.auditSchemas,
    system: exports.systemSchemas,
    validate: exports.validate,
    validateAsync: exports.validateAsync,
    validateFile: exports.validateFile,
    validateId: exports.validateId,
    validateEmail: exports.validateEmail,
    validateUrl: exports.validateUrl,
    sanitizeInput: exports.sanitizeInput,
    sanitizeObject: exports.sanitizeObject,
};
//# sourceMappingURL=validation.js.map