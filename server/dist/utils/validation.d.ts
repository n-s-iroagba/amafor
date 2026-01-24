import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const commonSchemas: {
    id: Joi.StringSchema<string>;
    email: Joi.StringSchema<string>;
    password: Joi.StringSchema<string>;
    phone: Joi.StringSchema<string>;
    url: Joi.StringSchema<string>;
    date: Joi.DateSchema<Date>;
    dateTime: Joi.DateSchema<Date>;
    amount: Joi.NumberSchema<number>;
    pagination: {
        page: Joi.NumberSchema<number>;
        limit: Joi.NumberSchema<number>;
    };
};
export declare const userSchemas: {
    login: Joi.ObjectSchema<any>;
    register: Joi.ObjectSchema<any>;
    updateProfile: Joi.ObjectSchema<any>;
    scoutRegistration: Joi.ObjectSchema<any>;
    advertiserRegistration: Joi.ObjectSchema<any>;
    donorRegistration: Joi.ObjectSchema<any>;
    resetPassword: Joi.ObjectSchema<any>;
};
export declare const playerSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    filter: Joi.ObjectSchema<any>;
};
export declare const articleSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    filter: Joi.ObjectSchema<any>;
};
export declare const fixtureSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    filter: Joi.ObjectSchema<any>;
    lineup: Joi.ObjectSchema<any>;
};
export declare const advertisingSchemas: {
    campaignCreate: Joi.ObjectSchema<any>;
    campaignUpdate: Joi.ObjectSchema<any>;
    campaignFilter: Joi.ObjectSchema<any>;
    creativeUpload: Joi.ObjectSchema<any>;
    disputeCreate: Joi.ObjectSchema<any>;
    adViewEvent: Joi.ObjectSchema<any>;
};
export declare const donationSchemas: {
    create: Joi.ObjectSchema<any>;
    filter: Joi.ObjectSchema<any>;
};
export declare const patronageSchemas: {
    subscribe: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    filter: Joi.ObjectSchema<any>;
    manualCreate: Joi.ObjectSchema<any>;
};
export declare const analyticsSchemas: {
    dateRange: Joi.ObjectSchema<any>;
    contentAnalytics: Joi.ObjectSchema<any>;
    financialAnalytics: Joi.ObjectSchema<any>;
    userEngagement: Joi.ObjectSchema<any>;
};
export declare const auditSchemas: {
    filter: Joi.ObjectSchema<any>;
    export: Joi.ObjectSchema<any>;
};
export declare const systemSchemas: {
    configUpdate: Joi.ObjectSchema<any>;
    notificationFilter: Joi.ObjectSchema<any>;
    cookieConsent: Joi.ObjectSchema<any>;
};
export declare const validate: (schema: Joi.ObjectSchema, property?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateAsync: (data: any, schema: Joi.ObjectSchema) => Promise<{
    valid: boolean;
    errors?: any[];
    value?: any;
}>;
export declare const validateFile: (file: Express.Multer.File, allowedTypes: string[], maxSize: number) => {
    valid: boolean;
    errors: string[] | undefined;
};
export declare const validateId: (id: string) => boolean;
export declare const validateEmail: (email: string) => boolean;
export declare const validateUrl: (url: string) => boolean;
export declare const sanitizeInput: (input: string) => string;
export declare const sanitizeObject: (obj: any) => any;
declare const _default: {
    common: {
        id: Joi.StringSchema<string>;
        email: Joi.StringSchema<string>;
        password: Joi.StringSchema<string>;
        phone: Joi.StringSchema<string>;
        url: Joi.StringSchema<string>;
        date: Joi.DateSchema<Date>;
        dateTime: Joi.DateSchema<Date>;
        amount: Joi.NumberSchema<number>;
        pagination: {
            page: Joi.NumberSchema<number>;
            limit: Joi.NumberSchema<number>;
        };
    };
    user: {
        login: Joi.ObjectSchema<any>;
        register: Joi.ObjectSchema<any>;
        updateProfile: Joi.ObjectSchema<any>;
        scoutRegistration: Joi.ObjectSchema<any>;
        advertiserRegistration: Joi.ObjectSchema<any>;
        donorRegistration: Joi.ObjectSchema<any>;
        resetPassword: Joi.ObjectSchema<any>;
    };
    player: {
        create: Joi.ObjectSchema<any>;
        update: Joi.ObjectSchema<any>;
        filter: Joi.ObjectSchema<any>;
    };
    article: {
        create: Joi.ObjectSchema<any>;
        update: Joi.ObjectSchema<any>;
        filter: Joi.ObjectSchema<any>;
    };
    fixture: {
        create: Joi.ObjectSchema<any>;
        update: Joi.ObjectSchema<any>;
        filter: Joi.ObjectSchema<any>;
        lineup: Joi.ObjectSchema<any>;
    };
    advertising: {
        campaignCreate: Joi.ObjectSchema<any>;
        campaignUpdate: Joi.ObjectSchema<any>;
        campaignFilter: Joi.ObjectSchema<any>;
        creativeUpload: Joi.ObjectSchema<any>;
        disputeCreate: Joi.ObjectSchema<any>;
        adViewEvent: Joi.ObjectSchema<any>;
    };
    donation: {
        create: Joi.ObjectSchema<any>;
        filter: Joi.ObjectSchema<any>;
    };
    patronage: {
        subscribe: Joi.ObjectSchema<any>;
        update: Joi.ObjectSchema<any>;
        filter: Joi.ObjectSchema<any>;
        manualCreate: Joi.ObjectSchema<any>;
    };
    analytics: {
        dateRange: Joi.ObjectSchema<any>;
        contentAnalytics: Joi.ObjectSchema<any>;
        financialAnalytics: Joi.ObjectSchema<any>;
        userEngagement: Joi.ObjectSchema<any>;
    };
    audit: {
        filter: Joi.ObjectSchema<any>;
        export: Joi.ObjectSchema<any>;
    };
    system: {
        configUpdate: Joi.ObjectSchema<any>;
        notificationFilter: Joi.ObjectSchema<any>;
        cookieConsent: Joi.ObjectSchema<any>;
    };
    validate: (schema: Joi.ObjectSchema, property?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateAsync: (data: any, schema: Joi.ObjectSchema) => Promise<{
        valid: boolean;
        errors?: any[];
        value?: any;
    }>;
    validateFile: (file: Express.Multer.File, allowedTypes: string[], maxSize: number) => {
        valid: boolean;
        errors: string[] | undefined;
    };
    validateId: (id: string) => boolean;
    validateEmail: (email: string) => boolean;
    validateUrl: (url: string) => boolean;
    sanitizeInput: (input: string) => string;
    sanitizeObject: (obj: any) => any;
};
export default _default;
//# sourceMappingURL=validation.d.ts.map