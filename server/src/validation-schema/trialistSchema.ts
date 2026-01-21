import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';

export const trialistValidationSchemas = {
  createTrialist: z.object({
    body: z.object({
      firstName: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be at most 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),

      lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be at most 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),

      email: z.string()
        .email('Invalid email address')
        .max(100, 'Email must be at most 100 characters'),

      phone: z.string()
        .min(10, 'Phone number must be at least 10 characters')
        .max(20, 'Phone number must be at most 20 characters')
        .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format'),

      dob: z.string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        })
        .transform((val) => new Date(val)),

      position: z.string()
        .min(2, 'Position must be at least 2 characters')
        .max(50, 'Position must be at most 50 characters'),

      preferredFoot: z.enum(['LEFT', 'RIGHT', 'BOTH'], {
        errorMap: () => ({ message: 'Preferred foot must be LEFT, RIGHT, or BOTH' }),
      }),

      height: z.number()
        .int()
        .min(100, 'Height must be at least 100cm')
        .max(250, 'Height must be at most 250cm')
        .optional(),

      weight: z.number()
        .int()
        .min(30, 'Weight must be at least 30kg')
        .max(150, 'Weight must be at most 150kg')
        .optional(),

      previousClub: z.string()
        .max(100, 'Previous club name must be at most 100 characters')
        .optional(),

      status: z.enum(['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'])
        .default('PENDING'),

      notes: z.string()
        .max(2000, 'Notes must be at most 2000 characters')
        .optional(),
    }),
  }),

  updateTrialist: z.object({
    params: z.object({
      id: z.string().uuid('Invalid trialist ID format'),
    }),
    body: z.object({
      firstName: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be at most 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces')
        .optional(),

      lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be at most 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces')
        .optional(),

      email: z.string()
        .email('Invalid email address')
        .max(100, 'Email must be at most 100 characters')
        .optional(),

      phone: z.string()
        .min(10, 'Phone number must be at least 10 characters')
        .max(20, 'Phone number must be at most 20 characters')
        .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
        .optional(),

      dob: z.string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        })
        .transform((val) => new Date(val))
        .optional(),

      position: z.string()
        .min(2, 'Position must be at least 2 characters')
        .max(50, 'Position must be at most 50 characters')
        .optional(),

      preferredFoot: z.enum(['LEFT', 'RIGHT', 'BOTH'], {
        errorMap: () => ({ message: 'Preferred foot must be LEFT, RIGHT, or BOTH' }),
      }).optional(),

      height: z.number()
        .int()
        .min(100, 'Height must be at least 100cm')
        .max(250, 'Height must be at most 250cm')
        .optional()
        .nullable(),

      weight: z.number()
        .int()
        .min(30, 'Weight must be at least 30kg')
        .max(150, 'Weight must be at most 150kg')
        .optional()
        .nullable(),

      previousClub: z.string()
        .max(100, 'Previous club name must be at most 100 characters')
        .optional()
        .nullable(),

      status: z.enum(['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'])
        .optional(),

      notes: z.string()
        .max(2000, 'Notes must be at most 2000 characters')
        .optional()
        .nullable(),
    }),
  }),

  trialistIdParam: z.object({
    params: z.object({
      id: z.string().uuid('Invalid trialist ID format'),
    }),
  }),

  updateStatus: z.object({
    params: z.object({
      id: z.string().uuid('Invalid trialist ID format'),
    }),
    body: z.object({
      status: z.enum(['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'], {
        errorMap: () => ({ message: 'Status must be PENDING, REVIEWED, INVITED, or REJECTED' }),
      }),
    }),
  }),

  searchQuery: z.object({
    query: z.object({
      keyword: z.string().min(1, 'Search keyword is required'),
    }),
  }),

  filterQuery: z.object({
    query: z.object({
      status: z.enum(['all', 'PENDING', 'REVIEWED', 'INVITED', 'REJECTED'])
        .optional(),
      position: z.string().optional(),
      search: z.string().optional(),
      page: z.string().regex(/^\d+$/).transform(Number).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      sortBy: z.enum(['firstName', 'lastName', 'email', 'position', 'status', 'createdAt', 'updatedAt'])
        .optional(),
      sortOrder: z.enum(['ASC', 'DESC']).optional(),
    }),
  }),
};



