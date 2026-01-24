import { z } from 'zod';

export const createFixtureImageSchema = z.object({
    body: z.object({
        fixtureId: z.string().uuid(),
        url: z.string().url(),
        type: z.string().optional(),
    }),
});

export const updateFixtureImageSchema = z.object({
    body: z.object({
        url: z.string().url().optional(),
        type: z.string().optional(),
    }),
});

export const getFixtureImageSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const deleteFixtureImageSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const getFixtureImagesByFixtureSchema = z.object({
    params: z.object({
        fixtureId: z.string().uuid(),
    }),
});

export default {
    create: createFixtureImageSchema,
    update: updateFixtureImageSchema,
    get: getFixtureImageSchema,
    delete: deleteFixtureImageSchema,
    getByFixture: getFixtureImagesByFixtureSchema,
};
