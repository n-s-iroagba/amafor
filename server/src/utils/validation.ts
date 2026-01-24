import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { tracer } from './tracer';

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/),
  url: Joi.string().uri(),
  date: Joi.date().iso(),
  dateTime: Joi.date().iso(),
  amount: Joi.number().positive(),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  },
};

// User validation schemas
export const userSchemas = {
  login: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
  }),

  register: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phone: commonSchemas.phone,
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(100),
    lastName: Joi.string().min(2).max(100),
    phone: commonSchemas.phone,
    avatarUrl: commonSchemas.url,
  }),

  scoutRegistration: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    organization: Joi.string().min(2).max(200).required(),
    socialMediaUrl: commonSchemas.url,
    reason: Joi.string().min(10).max(1000).required(),
  }),

  advertiserRegistration: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    businessName: Joi.string().min(2).max(200).required(),
    phone: commonSchemas.phone.required(),
    website: commonSchemas.url,
  }),

  donorRegistration: Joi.object({
    email: commonSchemas.email,
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phone: commonSchemas.phone,
    optInSupporterWall: Joi.boolean().default(false),
  }),

  resetPassword: Joi.object({
    password: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  }),
};

// Player validation schemas
export const playerSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    dateOfBirth: commonSchemas.date.required(),
    position: Joi.string().valid('GK', 'DF', 'MF', 'FW').required(),
    height: Joi.number().positive().max(3),
    nationality: Joi.string().max(100),
    biography: Joi.string().max(5000),
    jerseyNumber: Joi.number().integer().min(1).max(99),
    imageUrl: commonSchemas.url,
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(200),
    dateOfBirth: commonSchemas.date,
    position: Joi.string().valid('GK', 'DF', 'MF', 'FW'),
    height: Joi.number().positive().max(3),
    nationality: Joi.string().max(100),
    biography: Joi.string().max(5000),
    jerseyNumber: Joi.number().integer().min(1).max(99),
    imageUrl: commonSchemas.url,
    status: Joi.string().valid('active', 'injured', 'suspended', 'transferred'),
    contactInfo: Joi.object({
      email: commonSchemas.email,
      phone: commonSchemas.phone,
      agentName: Joi.string().max(200),
      agentContact: Joi.string().max(200),
    }),
  }),

  filter: Joi.object({
    position: Joi.string().valid('GK', 'DF', 'MF', 'FW'),
    minAge: Joi.number().integer().min(16).max(40),
    maxAge: Joi.number().integer().min(16).max(40),
    search: Joi.string(),
    sortBy: Joi.string().valid('name', 'age', 'position').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),
};

// Article validation schemas
export const articleSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(500).required(),
    content: Joi.string().min(50).required(),
    excerpt: Joi.string().max(500),
    featuredImage: commonSchemas.url,
    tags: Joi.array().items(
      Joi.string().valid(
        'football_news',
        'match_report',
        'academy_update',
        'player_spotlight',
        'club_announcement'
      )
    ).default([]),
    videoUrl: commonSchemas.url,
    status: Joi.string().valid('draft', 'published').default('draft'),
    scheduledPublishAt: commonSchemas.dateTime,
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(500),
    content: Joi.string().min(50),
    excerpt: Joi.string().max(500),
    featuredImage: commonSchemas.url,
    tags: Joi.array().items(
      Joi.string().valid(
        'football_news',
        'match_report',
        'academy_update',
        'player_spotlight',
        'club_announcement'
      )
    ),
    videoUrl: commonSchemas.url,
    status: Joi.string().valid('draft', 'scheduled', 'published', 'archived'),
  }),

  filter: Joi.object({
    tag: Joi.string().valid(
      'football_news',
      'match_report',
      'academy_update',
      'player_spotlight',
      'club_announcement'
    ),
    author: Joi.string(),
    dateFrom: commonSchemas.date,
    dateTo: commonSchemas.date,
    search: Joi.string(),
    sortBy: Joi.string().valid('publishedAt', 'updatedAt', 'views').default('publishedAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),
};

// Fixture validation schemas
export const fixtureSchemas = {
  create: Joi.object({
    matchDate: commonSchemas.dateTime.required(),
    homeTeam: Joi.string().min(2).max(200).required(),
    awayTeam: Joi.string().min(2).max(200).required(),
    competition: Joi.string().min(2).max(200).required(),
    venue: Joi.string().max(200),
    homeScore: Joi.number().integer().min(0),
    awayScore: Joi.number().integer().min(0),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled').default('scheduled'),
  }),

  update: Joi.object({
    matchDate: commonSchemas.dateTime,
    homeTeam: Joi.string().min(2).max(200),
    awayTeam: Joi.string().min(2).max(200),
    competition: Joi.string().min(2).max(200),
    venue: Joi.string().max(200),
    homeScore: Joi.number().integer().min(0),
    awayScore: Joi.number().integer().min(0),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled'),
    attendance: Joi.number().integer().min(0),
    referee: Joi.string().max(200),
  }),

  filter: Joi.object({
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled', 'upcoming', 'past', 'all'),
    dateFrom: commonSchemas.date,
    dateTo: commonSchemas.date,
    competition: Joi.string(),
    search: Joi.string(),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),

  lineup: Joi.object({
    formation: Joi.string().required(),
    startingXI: Joi.array().items(
      Joi.object({
        playerId: Joi.string().uuid().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
        shirtNumber: Joi.number().integer().min(1).max(99),
      })
    ).min(11).max(11),
    substitutes: Joi.array().items(
      Joi.object({
        playerId: Joi.string().uuid().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
        shirtNumber: Joi.number().integer().min(1).max(99),
      })
    ).max(7),
    coach: Joi.string(),
  }),
};

// Advertising validation schemas
export const advertisingSchemas = {
  campaignCreate: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    zone: Joi.string().valid(
      'homepage_banner',
      'top_page_banner',
      'sidebar',
      'article_footer',
      'mid_article'
    ).required(),
    creativeId: Joi.string().uuid().required(),
    targetViews: Joi.number().integer().min(1000).required(),
    targeting: Joi.object({
      type: Joi.string().valid('homepage', 'tags').default('homepage'),
      tags: Joi.array().items(
        Joi.string().valid(
          'football_news',
          'match_report',
          'academy_update',
          'player_spotlight',
          'club_announcement'
        )
      ).default([]),
      devices: Joi.array().items(
        Joi.string().valid('desktop', 'tablet', 'mobile')
      ).default(['desktop', 'tablet', 'mobile']),
    }).default({}),
    startDate: commonSchemas.dateTime,
    endDate: commonSchemas.dateTime,
  }),

  campaignUpdate: Joi.object({
    name: Joi.string().min(2).max(200),
    targeting: Joi.object({
      type: Joi.string().valid('homepage', 'tags'),
      tags: Joi.array().items(
        Joi.string().valid(
          'football_news',
          'match_report',
          'academy_update',
          'player_spotlight',
          'club_announcement'
        )
      ),
      devices: Joi.array().items(
        Joi.string().valid('desktop', 'tablet', 'mobile')
      ),
    }),
    status: Joi.string().valid('active', 'paused'),
  }),

  campaignFilter: Joi.object({
    status: Joi.string().valid('draft', 'pending_payment', 'active', 'paused', 'completed', 'cancelled'),
    dateFrom: commonSchemas.date,
    dateTo: commonSchemas.date,
    search: Joi.string(),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),

  creativeUpload: Joi.object({
    zone: Joi.string().valid(
      'homepage_banner',
      'top_page_banner',
      'sidebar',
      'article_footer',
      'mid_article'
    ).required(),
    campaignId: Joi.string().uuid(),
  }),

  disputeCreate: Joi.object({
    campaignId: Joi.string().uuid().required(),
    subject: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(5000).required(),
    attachments: Joi.array().items(commonSchemas.url),
  }),

  adViewEvent: Joi.object({
    campaignId: Joi.string().uuid().required(),
    userId: Joi.string().required(),
    sessionId: Joi.string().required(),
    viewportSize: Joi.object({
      width: Joi.number().integer().positive(),
      height: Joi.number().integer().positive(),
    }),
    visibilityPercentage: Joi.number().min(0).max(100),
    duration: Joi.number().positive(),
    url: commonSchemas.url,
    userAgent: Joi.string(),
    ipAddress: Joi.string().ip(),
    timestamp: commonSchemas.dateTime,
  }),
};

// Donation validation schemas
export const donationSchemas = {
  create: Joi.object({
    amount: Joi.number().positive().min(100).required(),
    email: commonSchemas.email.required(),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phone: commonSchemas.phone,
    message: Joi.string().max(500),
    optInSupporterWall: Joi.boolean().default(false),
    anonymous: Joi.boolean().default(false),
  }),

  filter: Joi.object({
    status: Joi.string().valid('pending', 'completed', 'failed', 'refunded'),
    dateFrom: commonSchemas.date,
    dateTo: commonSchemas.date,
    search: Joi.string(),
    donorEmail: commonSchemas.email,
    sortBy: Joi.string().valid('amount', 'createdAt', 'completedAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),
};

// Patronage validation schemas
export const patronageSchemas = {
  subscribe: Joi.object({
    tier: Joi.string().valid(
      'sponsor_grand_patron',
      'patron',
      'supporter',
      'advocate',
      'legend'
    ).required(),
    frequency: Joi.string().valid('monthly', 'yearly', 'lifetime').required(),
    portraitUrl: commonSchemas.url,
    logoUrl: commonSchemas.url,
    displayName: Joi.string().min(2).max(200).required(),
    message: Joi.string().max(500),
  }),

  update: Joi.object({
    portraitUrl: commonSchemas.url,
    logoUrl: commonSchemas.url,
    displayName: Joi.string().min(2).max(200),
    message: Joi.string().max(500),
  }),

  filter: Joi.object({
    tier: Joi.string().valid(
      'sponsor_grand_patron',
      'patron',
      'supporter',
      'advocate',
      'legend'
    ),
    status: Joi.string().valid('active', 'cancelled', 'expired', 'payment_failed'),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),

  manualCreate: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    tier: Joi.string().valid(
      'sponsor_grand_patron',
      'patron',
      'supporter',
      'advocate',
      'legend'
    ).required(),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    portraitUrl: commonSchemas.url,
    logoUrl: commonSchemas.url,
    displayName: Joi.string().min(2).max(200),
    message: Joi.string().max(500),
    commitmentAmount: Joi.number().positive(),
    commitmentFrequency: Joi.string().valid('monthly', 'yearly', 'lifetime', 'one_time'),
    isCorporate: Joi.boolean().default(false),
  }),
};

// Analytics validation schemas
export const analyticsSchemas = {
  dateRange: Joi.object({
    dateFrom: commonSchemas.date.required(),
    dateTo: commonSchemas.date.required(),
  }),

  contentAnalytics: Joi.object({
    contentId: Joi.string().uuid(),
    contentType: Joi.string().valid('article', 'video', 'player'),
    dateFrom: commonSchemas.date.required(),
    dateTo: commonSchemas.date.required(),
    granularity: Joi.string().valid('daily', 'weekly', 'monthly').default('daily'),
  }),

  financialAnalytics: Joi.object({
    dateFrom: commonSchemas.date.required(),
    dateTo: commonSchemas.date.required(),
    type: Joi.string().valid('donations', 'advertising', 'patronage', 'all').default('all'),
  }),

  userEngagement: Joi.object({
    dateFrom: commonSchemas.date.required(),
    dateTo: commonSchemas.date.required(),
    userType: Joi.string().valid('fan', 'scout', 'advertiser', 'patron', 'donor'),
  }),
};

// Audit validation schemas
export const auditSchemas = {
  filter: Joi.object({
    entityType: Joi.string().valid('user', 'player', 'article', 'fixture', 'campaign', 'donation', 'patron'),
    entityId: Joi.string(),
    userId: Joi.string().uuid(),
    action: Joi.string().valid('create', 'update', 'delete', 'login', 'logout', 'payment'),
    dateFrom: commonSchemas.dateTime,
    dateTo: commonSchemas.dateTime,
    ipAddress: Joi.string().ip(),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),

  export: Joi.object({
    format: Joi.string().valid('csv', 'json').default('csv'),
    dateFrom: commonSchemas.date.required(),
    dateTo: commonSchemas.date.required(),
  }),
};

// System validation schemas
export const systemSchemas = {
  configUpdate: Joi.object().pattern(
    Joi.string(),
    Joi.any()
  ),

  notificationFilter: Joi.object({
    type: Joi.string().valid('system', 'user', 'payment', 'content', 'security'),
    unreadOnly: Joi.boolean().default(false),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),

  cookieConsent: Joi.object({
    preference: Joi.string().valid('accept', 'reject').required(),
    sessionId: Joi.string(),
  }),
};

// Validation middleware
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    return tracer.startActiveSpan('validation.middleware', async (span) => {
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

          logger.warn('Validation failed', {
            path: req.path,
            errors,
            userId: (req as any).user?.id,
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
      } catch (validationError: any) {
        span.setStatus({
          code: 2,
          message: validationError.message,
        });

        logger.error('Validation middleware error', {
          error: validationError.message,
          path: req.path,
        });

        return res.status(500).json({
          error: 'Validation Error',
          message: 'An error occurred during validation',
        });
      } finally {
        span.end();
      }
    });
  };
};

// Async validation helper
export const validateAsync = async (data: any, schema: Joi.ObjectSchema): Promise<{ valid: boolean; errors?: any[]; value?: any }> => {
  return tracer.startActiveSpan('validation.async', async (span) => {
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
    } catch (validationError: any) {
      span.setStatus({
        code: 2,
        message: validationError.message,
      });

      throw validationError;
    } finally {
      span.end();
    }
  });
};

// Validate file upload
export const validateFile = (file: Express.Multer.File, allowedTypes: string[], maxSize: number) => {
  const errors: string[] = [];

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

// Validate ID parameter
export const validateId = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Sanitize input
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim() // Trim whitespace
    .substring(0, 10000); // Limit length
};

// Sanitize object
export const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Export all schemas
export default {
  common: commonSchemas,
  user: userSchemas,
  player: playerSchemas,
  article: articleSchemas,
  fixture: fixtureSchemas,
  advertising: advertisingSchemas,
  donation: donationSchemas,
  patronage: patronageSchemas,
  analytics: analyticsSchemas,
  audit: auditSchemas,
  system: systemSchemas,
  validate,
  validateAsync,
  validateFile,
  validateId,
  validateEmail,
  validateUrl,
  sanitizeInput,
  sanitizeObject,
};