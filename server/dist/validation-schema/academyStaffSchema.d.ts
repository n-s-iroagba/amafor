import { z } from 'zod';
export declare const academyStaffSchema: {
    createStaff: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            role: z.ZodString;
            bio: z.ZodString;
            initials: z.ZodOptional<z.ZodString>;
            imageUrl: z.ZodOptional<z.ZodString>;
            category: any;
            qualifications: z.ZodOptional<z.ZodArray<z.ZodString>>;
            yearsOfExperience: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
    updateStaff: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip, z.core.$strip>;
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodString>;
            bio: z.ZodOptional<z.ZodString>;
            initials: z.ZodOptional<z.ZodString>;
            imageUrl: z.ZodOptional<z.ZodString>;
            category: any;
            qualifications: z.ZodOptional<z.ZodArray<z.ZodString>>;
            yearsOfExperience: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
    queryStaff: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, any>>>;
            limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, any>>>;
            category: any;
            search: z.ZodOptional<z.ZodString>;
            minExperience: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, any>>>;
            maxExperience: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, any>>>;
            sortBy: any;
            sortOrder: any;
        }, z.core.$strip, z.core.$strip>;
    }, z.core.$strip, z.core.$strip>;
};
//# sourceMappingURL=academyStaffSchema.d.ts.map