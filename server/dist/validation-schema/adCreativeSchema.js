"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adCreativeSchema = void 0;
const zod_1 = require("zod");
const CREATIVE_TYPES = ['image', 'video'];
exports.adCreativeSchema = {
    createAdCreative: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(150, 'Name must be at most 150 characters'),
            type: zod_1.z.enum(CREATIVE_TYPES, {
                message: 'Invalid creative type'
            }),
            format: zod_1.z.string().min(2, 'Format is required'),
            url: zod_1.z.string().url('Invalid URL'),
            campaignId: zod_1.z.string().uuid('Invalid Campaign ID'),
            zoneId: zod_1.z.string().uuid('Invalid Zone ID'),
            destinationUrl: zod_1.z.string().url('Invalid Destination URL').optional(),
            duration: zod_1.z.number().int().min(0).optional(),
            dimensions: zod_1.z.object({
                width: zod_1.z.number().int().positive(),
                height: zod_1.z.number().int().positive()
            }).optional()
        })
    }),
    updateAdCreative: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid Creative ID')
        }),
        body: zod_1.z.object({
            name: zod_1.z.string().min(2).max(150).optional(),
            status: zod_1.z.enum(['active', 'inactive', 'archived']).optional(),
            url: zod_1.z.string().url().optional(),
            destinationUrl: zod_1.z.string().url().optional(),
            duration: zod_1.z.number().int().min(0).optional()
        })
    }),
    queryAdCreative: zod_1.z.object({
        query: zod_1.z.object({
            campaignId: zod_1.z.string().uuid().optional(),
            zoneId: zod_1.z.string().uuid().optional(),
            page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional()
        })
    })
};
//# sourceMappingURL=adCreativeSchema.js.map