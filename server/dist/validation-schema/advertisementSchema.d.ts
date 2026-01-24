import { z } from 'zod';
export declare const advertisementSchema: {
    createCampaign: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            budget: z.ZodNumber;
            startDate: z.ZodString;
            endDate: z.ZodString;
            zoneId: z.ZodString;
            targetImpressions: z.ZodOptional<z.ZodNumber>;
            dailyBudget: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateCampaign: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            budget: z.ZodOptional<z.ZodNumber>;
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                DRAFT: "DRAFT";
                ACTIVE: "ACTIVE";
                PENDING_PAYMENT: "PENDING_PAYMENT";
                PAUSED: "PAUSED";
                COMPLETED: "COMPLETED";
                EXPIRED: "EXPIRED";
                REJECTED: "REJECTED";
            }>>;
            targetImpressions: z.ZodOptional<z.ZodNumber>;
            dailyBudget: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    queryCampaigns: z.ZodObject<{
        query: z.ZodObject<{
            status: z.ZodOptional<z.ZodEnum<{
                DRAFT: "DRAFT";
                ACTIVE: "ACTIVE";
                PENDING_PAYMENT: "PENDING_PAYMENT";
                PAUSED: "PAUSED";
                COMPLETED: "COMPLETED";
                EXPIRED: "EXPIRED";
                REJECTED: "REJECTED";
            }>>;
            page: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            advertiserId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=advertisementSchema.d.ts.map