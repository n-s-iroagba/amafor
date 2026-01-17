export declare const commonSchemas: {
    id: any;
    email: any;
    password: any;
    phone: any;
    url: any;
    date: any;
    dateTime: any;
    amount: any;
    pagination: {
        page: any;
        limit: any;
    };
};
export declare const userSchemas: {
    login: any;
    register: any;
    updateProfile: any;
    scoutRegistration: any;
    advertiserRegistration: any;
    donorRegistration: any;
    resetPassword: any;
};
export declare const playerSchemas: {
    create: any;
    update: any;
    filter: any;
};
export declare const articleSchemas: {
    create: any;
    update: any;
    filter: any;
};
export declare const fixtureSchemas: {
    create: any;
    update: any;
    filter: any;
    lineup: any;
};
export declare const advertisingSchemas: {
    campaignCreate: any;
    campaignUpdate: any;
    campaignFilter: any;
    creativeUpload: any;
    disputeCreate: any;
    adViewEvent: any;
};
export declare const donationSchemas: {
    create: any;
    filter: any;
};
export declare const patronageSchemas: {
    subscribe: any;
    update: any;
    filter: any;
    manualCreate: any;
};
export declare const analyticsSchemas: {
    dateRange: any;
    contentAnalytics: any;
    financialAnalytics: any;
    userEngagement: any;
};
export declare const auditSchemas: {
    filter: any;
    export: any;
};
export declare const systemSchemas: {
    configUpdate: any;
    notificationFilter: any;
    cookieConsent: any;
};
export declare const validate: (schema: Joi.ObjectSchema, property?: 'body' | 'query' | 'params') => (req: Request, res: Response, next: NextFunction) => Promise<any>;
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
        id: any;
        email: any;
        password: any;
        phone: any;
        url: any;
        date: any;
        dateTime: any;
        amount: any;
        pagination: {
            page: any;
            limit: any;
        };
    };
    user: {
        login: any;
        register: any;
        updateProfile: any;
        scoutRegistration: any;
        advertiserRegistration: any;
        donorRegistration: any;
        resetPassword: any;
    };
    player: {
        create: any;
        update: any;
        filter: any;
    };
    article: {
        create: any;
        update: any;
        filter: any;
    };
    fixture: {
        create: any;
        update: any;
        filter: any;
        lineup: any;
    };
    advertising: {
        campaignCreate: any;
        campaignUpdate: any;
        campaignFilter: any;
        creativeUpload: any;
        disputeCreate: any;
        adViewEvent: any;
    };
    donation: {
        create: any;
        filter: any;
    };
    patronage: {
        subscribe: any;
        update: any;
        filter: any;
        manualCreate: any;
    };
    analytics: {
        dateRange: any;
        contentAnalytics: any;
        financialAnalytics: any;
        userEngagement: any;
    };
    audit: {
        filter: any;
        export: any;
    };
    system: {
        configUpdate: any;
        notificationFilter: any;
        cookieConsent: any;
    };
    validate: (schema: Joi.ObjectSchema, property?: "query" | "body" | "params") => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    validateAsync: (data: any, schema: Joi.ObjectSchema) => Promise<{
        valid: boolean;
        errors?: any[] | undefined;
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