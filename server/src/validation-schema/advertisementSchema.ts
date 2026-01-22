import { z } from 'zod';

export const advertisementSchema = {
    createCampaign: z.object({
        body: z.object({
            name: z.string().min(3, 'Name must be at least 3 characters').max(100),
            budget: z.number().positive('Budget must be positive'),
            startDate: z.string().datetime(),
            endDate: z.string().datetime(),
            zoneId: z.string().uuid('Invalid Zone ID'),
            targetImpressions: z.number().int().positive().optional(),
            dailyBudget: z.number().positive().optional()
        })
    }),

    updateCampaign: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Campaign ID')
        }),
        body: z.object({
            name: z.string().min(3).max(100).optional(),
            budget: z.number().positive().optional(),
            startDate: z.string().datetime().optional(),
            endDate: z.string().datetime().optional(),
            status: z.enum(['DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'EXPIRED', 'REJECTED']).optional(),
            targetImpressions: z.number().int().positive().optional(),
            dailyBudget: z.number().positive().optional()
        })
    }),

    queryCampaigns: z.object({
        query: z.object({
            status: z.enum(['DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'EXPIRED', 'REJECTED']).optional(),
            page: z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: z.string().regex(/^\d+$/).transform(Number).optional(),
            advertiserId: z.string().uuid().optional()
        })
    })
};
