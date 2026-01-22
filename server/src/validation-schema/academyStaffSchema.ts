import { z } from 'zod';

const CATEGORIES = ['coaching', 'medical', 'administrative', 'technical', 'scouting'] as const;

export const academyStaffSchema = {
  createStaff: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(150, 'Name must be at most 150 characters'),
      role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role must be at most 100 characters'),
      bio: z.string().min(10, 'Bio must be at least 10 characters').max(2000, 'Bio must be at most 2000 characters'),
      initials: z.string().max(10, 'Initials cannot exceed 10 characters').optional(),
      imageUrl: z.string().url('Image URL must be a valid URL').optional(),
      category: z.enum(CATEGORIES).optional(),
      qualifications: z.array(z.string()).optional(),
      yearsOfExperience: z.number().int().min(0).max(60).optional()
    })
  }),

  updateStaff: z.object({
    params: z.object({
      id: z.string().uuid('Invalid staff ID')
    }),
    body: z.object({
      name: z.string().min(2).max(150).optional(),
      role: z.string().min(2).max(100).optional(),
      bio: z.string().min(10).max(2000).optional(),
      initials: z.string().max(10).optional(),
      imageUrl: z.string().url().optional(),
      category: z.enum(['coaching', 'medical', 'administrative', 'technical', 'scouting']).optional(),
      qualifications: z.array(z.string()).optional(),
      yearsOfExperience: z.number().int().min(0).max(60).optional()
    })
  }),

  queryStaff: z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/).transform(Number).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      category: z.enum(['coaching', 'medical', 'administrative', 'technical', 'scouting']).optional(),
      search: z.string().optional(),
      minExperience: z.string().regex(/^\d+$/).transform(Number).optional(),
      maxExperience: z.string().regex(/^\d+$/).transform(Number).optional(),
      sortBy: z.enum(['name', 'role', 'yearsOfExperience', 'createdAt']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional()
    })
  })
};