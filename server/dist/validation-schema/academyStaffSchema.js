"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academyStaffSchema = void 0;
const zod_1 = require("zod");
const CATEGORIES = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];
exports.academyStaffSchema = {
    createStaff: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(150, 'Name must be at most 150 characters'),
            role: zod_1.z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role must be at most 100 characters'),
            bio: zod_1.z.string().min(10, 'Bio must be at least 10 characters').max(2000, 'Bio must be at most 2000 characters'),
            initials: zod_1.z.string().max(10, 'Initials cannot exceed 10 characters').optional(),
            imageUrl: zod_1.z.string().url('Image URL must be a valid URL').optional(),
            category: zod_1.z.enum(CATEGORIES).optional(),
            qualifications: zod_1.z.array(zod_1.z.string()).optional(),
            yearsOfExperience: zod_1.z.number().int().min(0).max(60).optional()
        })
    }),
    updateStaff: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid staff ID')
        }),
        body: zod_1.z.object({
            name: zod_1.z.string().min(2).max(150).optional(),
            role: zod_1.z.string().min(2).max(100).optional(),
            bio: zod_1.z.string().min(10).max(2000).optional(),
            initials: zod_1.z.string().max(10).optional(),
            imageUrl: zod_1.z.string().url().optional(),
            category: zod_1.z.enum(['coaching', 'medical', 'administrative', 'technical', 'scouting']).optional(),
            qualifications: zod_1.z.array(zod_1.z.string()).optional(),
            yearsOfExperience: zod_1.z.number().int().min(0).max(60).optional()
        })
    }),
    queryStaff: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            category: zod_1.z.enum(['coaching', 'medical', 'administrative', 'technical', 'scouting']).optional(),
            search: zod_1.z.string().optional(),
            minExperience: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            maxExperience: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
            sortBy: zod_1.z.enum(['name', 'role', 'yearsOfExperience', 'createdAt']).optional(),
            sortOrder: zod_1.z.enum(['asc', 'desc']).optional()
        })
    })
};
//# sourceMappingURL=academyStaffSchema.js.map