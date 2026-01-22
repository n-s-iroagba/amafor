import { z } from 'zod';
export declare const trialistValidationSchemas: {
    createTrialist: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            phone: z.ZodString;
            dob: z.ZodPipe<z.ZodString, z.ZodTransform<Date, any>>;
            position: z.ZodString;
            preferredFoot: any;
            height: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            previousClub: z.ZodOptional<z.ZodString>;
            status: any;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
    updateTrialist: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip, z.core.$strip>;
        body: z.ZodObject<{
            firstName: z.ZodOptional<z.ZodString>;
            lastName: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            dob: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, any>>>;
            position: z.ZodOptional<z.ZodString>;
            preferredFoot: any;
            height: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            weight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            previousClub: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            status: any;
            notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
    trialistIdParam: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
    updateStatus: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip, z.core.$strip>;
        body: z.ZodObject<{
            status: any;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
    searchQuery: z.ZodObject<{
        query: z.ZodObject<{
            keyword: z.ZodString;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
    filterQuery: z.ZodObject<{
        query: z.ZodObject<{
            status: any;
            position: z.ZodOptional<z.ZodString>;
            search: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, any>>>;
            limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, any>>>;
            sortBy: any;
            sortOrder: any;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
};
//# sourceMappingURL=trialistSchema.d.ts.map