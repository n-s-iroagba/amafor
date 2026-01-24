import { z } from 'zod';
export declare const academyStaffSchema: {
    createStaff: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            role: z.ZodString;
            bio: z.ZodString;
            initials: z.ZodOptional<z.ZodString>;
            imageUrl: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodEnum<{
                coaching: "coaching";
                medical: "medical";
                administrative: "administrative";
                technical: "technical";
                scouting: "scouting";
            }>>;
            qualifications: z.ZodOptional<z.ZodArray<z.ZodString>>;
            yearsOfExperience: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateStaff: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodString>;
            bio: z.ZodOptional<z.ZodString>;
            initials: z.ZodOptional<z.ZodString>;
            imageUrl: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodEnum<{
                coaching: "coaching";
                medical: "medical";
                administrative: "administrative";
                technical: "technical";
                scouting: "scouting";
            }>>;
            qualifications: z.ZodOptional<z.ZodArray<z.ZodString>>;
            yearsOfExperience: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    queryStaff: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            category: z.ZodOptional<z.ZodEnum<{
                coaching: "coaching";
                medical: "medical";
                administrative: "administrative";
                technical: "technical";
                scouting: "scouting";
            }>>;
            search: z.ZodOptional<z.ZodString>;
            minExperience: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            maxExperience: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            sortBy: z.ZodOptional<z.ZodEnum<{
                createdAt: "createdAt";
                name: "name";
                yearsOfExperience: "yearsOfExperience";
                role: "role";
            }>>;
            sortOrder: z.ZodOptional<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=academyStaffSchema.d.ts.map