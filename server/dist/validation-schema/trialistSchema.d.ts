import { z } from 'zod';
export declare const trialistValidationSchemas: {
    createTrialist: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            phone: z.ZodString;
            dob: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            position: z.ZodString;
            preferredFoot: z.ZodEnum<{
                LEFT: "LEFT";
                RIGHT: "RIGHT";
                BOTH: "BOTH";
            }>;
            height: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            previousClub: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<{
                PENDING: "PENDING";
                REVIEWED: "REVIEWED";
                INVITED: "INVITED";
                REJECTED: "REJECTED";
            }>>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateTrialist: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            firstName: z.ZodOptional<z.ZodString>;
            lastName: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            dob: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>;
            position: z.ZodOptional<z.ZodString>;
            preferredFoot: z.ZodOptional<z.ZodEnum<{
                LEFT: "LEFT";
                RIGHT: "RIGHT";
                BOTH: "BOTH";
            }>>;
            height: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            weight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            previousClub: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            status: z.ZodOptional<z.ZodEnum<{
                PENDING: "PENDING";
                REVIEWED: "REVIEWED";
                INVITED: "INVITED";
                REJECTED: "REJECTED";
            }>>;
            notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    trialistIdParam: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateStatus: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            status: z.ZodEnum<{
                PENDING: "PENDING";
                REVIEWED: "REVIEWED";
                INVITED: "INVITED";
                REJECTED: "REJECTED";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    searchQuery: z.ZodObject<{
        query: z.ZodObject<{
            keyword: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    filterQuery: z.ZodObject<{
        query: z.ZodObject<{
            status: z.ZodOptional<z.ZodEnum<{
                all: "all";
                PENDING: "PENDING";
                REVIEWED: "REVIEWED";
                INVITED: "INVITED";
                REJECTED: "REJECTED";
            }>>;
            position: z.ZodOptional<z.ZodString>;
            search: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
            sortBy: z.ZodOptional<z.ZodEnum<{
                createdAt: "createdAt";
                updatedAt: "updatedAt";
                status: "status";
                email: "email";
                firstName: "firstName";
                lastName: "lastName";
                position: "position";
            }>>;
            sortOrder: z.ZodOptional<z.ZodEnum<{
                DESC: "DESC";
                ASC: "ASC";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=trialistSchema.d.ts.map