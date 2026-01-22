"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advertisementSchema = void 0;
const zod_1 = require("zod");
exports.advertisementSchema = {
    createCampaign: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(3, 'Name must be at least 3 characters').max(100),
            budget: zod_1.z.number().positive('Budget must be positive'),
            startDate: zod_1.z.string().datetime(),
            endDate: zod_1.z.string().datetime(),
            zoneId: zod_1.z.string().uuid('Invalid Zone ID'),
            targetImpressions: zod_1.z.number().int().positive().optional(),
            dailyBudget: zod_1.z.number().positive().optional()
        })
    }),
    updateCampaign: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid Campaign ID')
        }),
        body: zod_1.z.object({
            name: zod_1.z.string().min(3).max(100).optional(),
            budget: zod_1.z.number().positive().optional(),
            startDate: zod_1.z.string().datetime().optional(),
            endDate: zod_1.z.string().datetime().optional(),
            status: zod_1.z.enum(['DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'EXPIRED', 'REJECTED']).optional(),
            targetImpressions: zod_1.z.number().int().positive().optional(),
            dailyBudget: zod_1.z.number().positive().optional()
        })
    }),
    queryCampaigns: zod_1.z.object({
        query: zod_1.z.object({
            status: zod_1.z.enum(['DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'EXPIRED', 'REJECTED']).optional(),
            page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            advertiserId: zod_1.z.string().uuid().optional()
        })
    })
};
//# sourceMappingURL=advertisementSchema.js.map