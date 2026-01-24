import { z } from 'zod';

export const createGoalSchema = z.object({
    body: z.object({
        playerId: z.string().uuid(),
        fixtureId: z.string().uuid(),
        minute: z.number().int().min(0).max(120),
        type: z.enum(['regular', 'penalty', 'own_goal']).optional(),
    }),
});

export const updateGoalSchema = z.object({
    body: z.object({
        minute: z.number().int().min(0).max(120).optional(),
        type: z.enum(['regular', 'penalty', 'own_goal']).optional(),
    }),
});

export const getGoalSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const deleteGoalSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const getGoalsByFixtureSchema = z.object({
    params: z.object({
        fixtureId: z.string().uuid(),
    }),
});

// Schema for getting goals by scorer (placeholder, similar to fixture)
export const getGoalsByScorerSchema = z.object({
    params: z.object({
        scorer: z.string().min(1, 'Scorer name or ID is required'),
    }),
});

export default {
    create: createGoalSchema,
    update: updateGoalSchema,
    get: getGoalSchema,
    delete: deleteGoalSchema,
    getByFixture: getGoalsByFixtureSchema,
    getByScorer: getGoalsByScorerSchema,
};
