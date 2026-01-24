import multer from 'multer';
export declare const AD_ZONE_SPECS: {
    homepage_banner: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
    top_page_banner: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
    sidebar: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
    article_footer: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
    mid_article: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
};
export declare const USER_UPLOAD_SPECS: {
    avatar: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
    patron_portrait: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
    patron_logo: {
        width: number;
        height: number;
        formats: string[];
        maxSize: number;
    };
};
export declare const generateFilename: (originalname: string, prefix?: string) => string;
export declare const upload: multer.Multer;
export declare const uploadFile: (file: Express.Multer.File, options: {
    type: string;
    userId?: string;
    metadata?: Record<string, any>;
    resizeOptions?: {
        width?: number;
        height?: number;
        quality?: number;
    };
}) => Promise<{
    success: boolean;
    url?: string;
    key?: string;
    filename?: string;
    size?: number;
    mimetype?: string;
    dimensions?: {
        width: number;
        height: number;
    };
    error?: string;
}>;
export declare const getFile: (key: string, options?: {
    expiresIn?: number;
    download?: boolean;
}) => Promise<{
    success: boolean;
    url?: string;
    buffer?: Buffer;
    mimetype?: string;
    error?: string;
}>;
export declare const deleteFile: (key: string) => Promise<{
    success: boolean;
    error?: string;
}>;
export declare const validateAdCreative: (file: Express.Multer.File, zone: string) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    dimensions?: {
        width: number;
        height: number;
    };
    actualSize: number;
}>;
export declare const generateThumbnail: (buffer: Buffer, options: {
    width: number;
    height: number;
    quality?: number;
    format?: "jpg" | "png" | "webp";
}) => Promise<Buffer>;
export declare const getMimeType: (extension: string) => string;
export declare const cleanupOldFiles: (olderThanDays?: number) => Promise<{
    deleted: number;
    errors: string[];
}>;
export declare const checkStorageHealth: () => Promise<{
    healthy: boolean;
    type: string;
    availableSpace?: number;
    error?: string;
}>;
declare const _default: {
    upload: multer.Multer;
    uploadFile: (file: Express.Multer.File, options: {
        type: string;
        userId?: string;
        metadata?: Record<string, any>;
        resizeOptions?: {
            width?: number;
            height?: number;
            quality?: number;
        };
    }) => Promise<{
        success: boolean;
        url?: string;
        key?: string;
        filename?: string;
        size?: number;
        mimetype?: string;
        dimensions?: {
            width: number;
            height: number;
        };
        error?: string;
    }>;
    getFile: (key: string, options?: {
        expiresIn?: number;
        download?: boolean;
    }) => Promise<{
        success: boolean;
        url?: string;
        buffer?: Buffer;
        mimetype?: string;
        error?: string;
    }>;
    deleteFile: (key: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    validateAdCreative: (file: Express.Multer.File, zone: string) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
        dimensions?: {
            width: number;
            height: number;
        };
        actualSize: number;
    }>;
    generateThumbnail: (buffer: Buffer, options: {
        width: number;
        height: number;
        quality?: number;
        format?: "jpg" | "png" | "webp";
    }) => Promise<Buffer>;
    getMimeType: (extension: string) => string;
    cleanupOldFiles: (olderThanDays?: number) => Promise<{
        deleted: number;
        errors: string[];
    }>;
    checkStorageHealth: () => Promise<{
        healthy: boolean;
        type: string;
        availableSpace?: number;
        error?: string;
    }>;
    AD_ZONE_SPECS: {
        homepage_banner: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
        top_page_banner: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
        sidebar: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
        article_footer: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
        mid_article: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
    };
    USER_UPLOAD_SPECS: {
        avatar: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
        patron_portrait: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
        patron_logo: {
            width: number;
            height: number;
            formats: string[];
            maxSize: number;
        };
    };
    STORAGE_TYPE: string;
};
export default _default;
//# sourceMappingURL=storage.d.ts.map