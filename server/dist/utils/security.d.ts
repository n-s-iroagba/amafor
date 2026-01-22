import { Request } from 'express';
import { UserType } from '@models/User';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateToken: (userId: string, userType: UserType, roles: string[]) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyToken: (token: string) => any;
export declare const verifyRefreshToken: (token: string) => any;
export declare const generateVerificationToken: () => {
    token: string;
    expires: Date;
};
export declare const generatePasswordResetToken: () => {
    token: string;
    expires: Date;
};
export declare const generateApiKey: () => string;
export declare const hashApiKey: (apiKey: string) => string;
export declare const generateCsrfToken: () => string;
export declare const validateCsrfToken: (token: string, sessionToken: string) => boolean;
export declare const sanitizeSqlInput: (input: string) => string;
export declare const createRateLimiterKey: (req: Request) => string;
export declare const checkPasswordStrength: (password: string) => {
    score: number;
    strength: 'weak' | 'medium' | 'strong' | 'very_strong';
    suggestions: string[];
};
export declare const generateRandomString: (length?: number) => string;
export declare const encryptData: (data: string, secret?: string) => string;
export declare const decryptData: (encryptedData: string, secret?: string) => string;
declare const _default: {
    hashPassword: (password: string) => Promise<string>;
    verifyPassword: (password: string, hash: string) => Promise<boolean>;
    generateToken: (userId: string, userType: UserType, roles: string[]) => string;
    generateRefreshToken: (userId: string) => string;
    verifyToken: (token: string) => any;
    verifyRefreshToken: (token: string) => any;
    generateVerificationToken: () => {
        token: string;
        expires: Date;
    };
    generatePasswordResetToken: () => {
        token: string;
        expires: Date;
    };
    generateApiKey: () => string;
    hashApiKey: (apiKey: string) => string;
    generateCsrfToken: () => string;
    validateCsrfToken: (token: string, sessionToken: string) => boolean;
    sanitizeSqlInput: (input: string) => string;
    createRateLimiterKey: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => string;
    checkPasswordStrength: (password: string) => {
        score: number;
        strength: "medium" | "weak" | "strong" | "very_strong";
        suggestions: string[];
    };
    generateRandomString: (length?: number) => string;
    encryptData: (data: string, secret?: string) => string;
    decryptData: (encryptedData: string, secret?: string) => string;
};
export default _default;
//# sourceMappingURL=security.d.ts.map