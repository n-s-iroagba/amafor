import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8).optional(), // optional for cases where it's generated, but usually required
        confirmPassword: z.string().optional(),
        firstName: z.string().min(2).optional(),
        lastName: z.string().min(2).optional(),
        contactName: z.string().optional(),
        companyName: z.string().optional(),
        businessName: z.string().optional(),
        contact_phone: z.string().optional(),
        phone: z.string().optional(),
        userType: z.string().optional(),
        role: z.enum(['advertiser', 'user', 'scout', 'admin']).optional().default('user'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
});

export default {
    register: registerSchema,
    login: loginSchema,
};
