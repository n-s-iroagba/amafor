/// <reference types="node" />
export interface FileUpload {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}
export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
    duration?: number;
    resourceType: string;
}
export declare class UploadService {
    /**
     * Upload image file
     */
    uploadImage(file: FileUpload): Promise<UploadResult>;
    /**
     * Upload video file
     */
    uploadVideo(file: FileUpload): Promise<UploadResult>;
    /**
     * Delete file from Cloudinary
     */
    deleteFile(publicId: string, resourceType?: 'image' | 'video'): Promise<void>;
    /**
     * Generate video thumbnail from uploaded video
     */
    generateVideoThumbnail(videoPublicId: string, options?: {
        width?: number;
        height?: number;
        timeOffset?: string;
    }): Promise<string>;
    /**
     * Get optimized URLs for different screen sizes
     */
    getResponsiveImageUrls(publicId: string): {
        thumbnail: any;
        small: any;
        medium: any;
        large: any;
    };
    /**
     * Get optimized video URLs for different qualities
     */
    getResponsiveVideoUrls(publicId: string): {
        low: any;
        medium: any;
        high: any;
    };
}
export declare const uploadService: UploadService;
//# sourceMappingURL=UploadService.d.ts.map