import { z } from 'zod';

export const validateLeagueStatistics = {
    create: z.object({
        body: z.object({
            leagueId: z.string().uuid(),
            teamId: z.string().uuid(),
        }),
    }),
    update: z.object({
        body: z.object({
            points: z.number().optional(),
            played: z.number().optional(),
            won: z.number().optional(),
            drawn: z.number().optional(),
            lost: z.number().optional(),
            goalsFor: z.number().optional(),
            goalsAgainst: z.number().optional(),
        }),
    }),
    getAll: z.object({
        params: z.object({
            leagueId: z.string().uuid()
        })
    }),
    getById: z.object({
        params: z.object({
            id: z.string().uuid()
        })
    }),
    getTeamStats: z.object({
        params: z.object({
            leagueId: z.string().uuid(),
            team: z.string().uuid()
        })
    }),
    updateFixtureResult: z.object({
        body: z.any()
    })
};
