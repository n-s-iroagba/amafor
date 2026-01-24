import { z } from 'zod';

const CREATIVE_TYPES = ['image', 'video'] as const;

export const adCreativeSchema = {
    createAdCreative: z.object({
        body: z.object({
            name: z.string().min(2, 'Name must be at least 2 characters').max(150, 'Name must be at most 150 characters'),
            type: z.enum(CREATIVE_TYPES as unknown as [string, ...string[]], {
                message: 'Invalid creative type'
            }),
            format: z.string().min(2, 'Format is required'),
            url: z.string().url('Invalid URL'),
            campaignId: z.string().uuid('Invalid Campaign ID'),
            zoneId: z.string().uuid('Invalid Zone ID'),
            destinationUrl: z.string().url('Invalid Destination URL').optional(),
            duration: z.number().int().min(0).optional(),
            dimensions: z.object({
                width: z.number().int().positive(),
                height: z.number().int().positive()
            }).optional()
        })
    }),

    updateAdCreative: z.object({
        params: z.object({
            id: z.string().uuid('Invalid Creative ID')
        }),
        body: z.object({
            name: z.string().min(2).max(150).optional(),
            status: z.enum(['active', 'inactive', 'archived']).optional(),
            url: z.string().url().optional(),
            destinationUrl: z.string().url().optional(),
            duration: z.number().int().min(0).optional()
        })
    }),

    queryAdCreative: z.object({
        query: z.object({
            campaignId: z.string().uuid().optional(),
            zoneId: z.string().uuid().optional(),
            page: z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: z.string().regex(/^\d+$/).transform(Number).optional()
        })
    })
};
