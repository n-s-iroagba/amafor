import { z } from 'zod';

export const createLineupSchema = z.object({
    body: z.object({
        fixtureId: z.string().uuid(),
        teamId: z.string().uuid(),
        players: z.array(z.object({
            playerId: z.string().uuid(),
            position: z.string(),
            isStarter: z.boolean(),
            captain: z.boolean().optional(),
        })),
    }),
});

export const updateLineupSchema = z.object({
    body: z.object({
        players: z.array(z.object({
            playerId: z.string().uuid(),
            position: z.string(),
            isStarter: z.boolean(),
            captain: z.boolean().optional(),
        })).optional(),
    }),
});

export const getLineupSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const deleteLineupSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const getLineupByFixtureSchema = z.object({
    params: z.object({
        fixtureId: z.string().uuid(),
    }),
});

export const batchUpdateLineupSchema = z.object({
    body: z.object({
        lineups: z.array(z.any()),
    }),
});

export default {
    create: createLineupSchema,
    update: updateLineupSchema,
    get: getLineupSchema,
    delete: deleteLineupSchema,
    getByFixture: getLineupByFixtureSchema,
    batchUpdate: batchUpdateLineupSchema,
};
