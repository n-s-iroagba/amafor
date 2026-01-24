"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialistValidationSchemas = void 0;
const zod_1 = require("zod");
exports.trialistValidationSchemas = {
    createTrialist: zod_1.z.object({
        body: zod_1.z.object({
            firstName: zod_1.z.string()
                .min(2, 'First name must be at least 2 characters')
                .max(50, 'First name must be at most 50 characters')
                .regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),
            lastName: zod_1.z.string()
                .min(2, 'Last name must be at least 2 characters')
                .max(50, 'Last name must be at most 50 characters')
                .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
            email: zod_1.z.string()
                .email('Invalid email address')
                .max(100, 'Email must be at most 100 characters'),
            phone: zod_1.z.string()
                .min(10, 'Phone number must be at least 10 characters')
                .max(20, 'Phone number must be at most 20 characters')
                .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format'),
            dob: zod_1.z.string()
                .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format',
            })
                .transform((val) => new Date(val)),
            position: zod_1.z.string()
                .min(2, 'Position must be at least 2 characters')
                .max(50, 'Position must be at most 50 characters'),
            preferredFoot: zod_1.z.enum(['LEFT', 'RIGHT', 'BOTH'], {
                message: 'Preferred foot must be LEFT, RIGHT, or BOTH',
            }),
            height: zod_1.z.number()
                .int()
                .min(100, 'Height must be at least 100cm')
                .max(250, 'Height must be at most 250cm')
                .optional(),
            weight: zod_1.z.number()
                .int()
                .min(30, 'Weight must be at least 30kg')
                .max(150, 'Weight must be at most 150kg')
                .optional(),
            previousClub: zod_1.z.string()
                .max(100, 'Previous club name must be at most 100 characters')
                .optional(),
            status: zod_1.z.enum(['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'])
                .default('PENDING'),
            notes: zod_1.z.string()
                .max(2000, 'Notes must be at most 2000 characters')
                .optional(),
        }),
    }),
    updateTrialist: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid trialist ID format'),
        }),
        body: zod_1.z.object({
            firstName: zod_1.z.string()
                .min(2, 'First name must be at least 2 characters')
                .max(50, 'First name must be at most 50 characters')
                .regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces')
                .optional(),
            lastName: zod_1.z.string()
                .min(2, 'Last name must be at least 2 characters')
                .max(50, 'Last name must be at most 50 characters')
                .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces')
                .optional(),
            email: zod_1.z.string()
                .email('Invalid email address')
                .max(100, 'Email must be at most 100 characters')
                .optional(),
            phone: zod_1.z.string()
                .min(10, 'Phone number must be at least 10 characters')
                .max(20, 'Phone number must be at most 20 characters')
                .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
                .optional(),
            dob: zod_1.z.string()
                .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format',
            })
                .transform((val) => new Date(val))
                .optional(),
            position: zod_1.z.string()
                .min(2, 'Position must be at least 2 characters')
                .max(50, 'Position must be at most 50 characters')
                .optional(),
            preferredFoot: zod_1.z.enum(['LEFT', 'RIGHT', 'BOTH'], {
                message: 'Preferred foot must be LEFT, RIGHT, or BOTH',
            }).optional(),
            height: zod_1.z.number()
                .int()
                .min(100, 'Height must be at least 100cm')
                .max(250, 'Height must be at most 250cm')
                .optional()
                .nullable(),
            weight: zod_1.z.number()
                .int()
                .min(30, 'Weight must be at least 30kg')
                .max(150, 'Weight must be at most 150kg')
                .optional()
                .nullable(),
            previousClub: zod_1.z.string()
                .max(100, 'Previous club name must be at most 100 characters')
                .optional()
                .nullable(),
            status: zod_1.z.enum(['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'])
                .optional(),
            notes: zod_1.z.string()
                .max(2000, 'Notes must be at most 2000 characters')
                .optional()
                .nullable(),
        }),
    }),
    trialistIdParam: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid trialist ID format'),
        }),
    }),
    updateStatus: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid trialist ID format'),
        }),
        body: zod_1.z.object({
            status: zod_1.z.enum(['PENDING', 'REVIEWED', 'INVITED', 'REJECTED'], {
                message: 'Status must be PENDING, REVIEWED, INVITED, or REJECTED',
            }),
        }),
    }),
    searchQuery: zod_1.z.object({
        query: zod_1.z.object({
            keyword: zod_1.z.string().min(1, 'Search keyword is required'),
        }),
    }),
    filterQuery: zod_1.z.object({
        query: zod_1.z.object({
            status: zod_1.z.enum(['all', 'PENDING', 'REVIEWED', 'INVITED', 'REJECTED'])
                .optional(),
            position: zod_1.z.string().optional(),
            search: zod_1.z.string().optional(),
            page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            sortBy: zod_1.z.enum(['firstName', 'lastName', 'email', 'position', 'status', 'createdAt', 'updatedAt'])
                .optional(),
            sortOrder: zod_1.z.enum(['ASC', 'DESC']).optional(),
        }),
    }),
};
//# sourceMappingURL=trialistSchema.js.map