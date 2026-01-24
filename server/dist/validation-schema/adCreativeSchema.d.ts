import { z } from 'zod';
export declare const adCreativeSchema: {
    createAdCreative: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                image: "image";
                video: "video";
            }>;
            format: z.ZodString;
            url: z.ZodString;
            campaignId: z.ZodString;
            zoneId: z.ZodString;
            destinationUrl: z.ZodOptional<z.ZodString>;
            duration: z.ZodOptional<z.ZodNumber>;
            dimensions: z.ZodOptional<z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateAdCreative: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                archived: "archived";
                active: "active";
                inactive: "inactive";
            }>>;
            url: z.ZodOptional<z.ZodString>;
            destinationUrl: z.ZodOptional<z.ZodString>;
            duration: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    queryAdCreative: z.ZodObject<{
        query: z.ZodObject<{
            campaignId: z.ZodOptional<z.ZodString>;
            zoneId: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=adCreativeSchema.d.ts.map