export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: any;
}
export interface TransformationOption {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    fetch_format?: string;
    gravity?: string;
    start_offset?: string;
    [key: string]: any;
}
export declare class CloudinaryService {
    uploadImage(buffer: Buffer, fileName: string, options: {
        folder: string;
        transformation?: TransformationOption[];
    }): Promise<CloudinaryUploadResult>;
    uploadVideo(buffer: Buffer, fileName: string, options: {
        folder: string;
        transformation?: TransformationOption[];
    }): Promise<CloudinaryUploadResult>;
    deleteFile(publicId: string, resourceType?: 'image' | 'video'): Promise<void>;
    generateVideoThumbnail(publicId: string, options: TransformationOption): Promise<string>;
    getOptimizedImageUrl(publicId: string, transformation: TransformationOption[]): string;
    getOptimizedVideoUrl(publicId: string, transformation: TransformationOption[]): string;
}
export declare const cloudinaryService: CloudinaryService;
//# sourceMappingURL=cloudinary.d.ts.map