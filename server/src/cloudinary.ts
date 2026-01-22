import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export class CloudinaryService {
    async uploadImage(
        buffer: Buffer,
        fileName: string,
        options: { folder: string; transformation?: TransformationOption[] }
    ): Promise<CloudinaryUploadResult> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    public_id: fileName,
                    folder: options.folder,
                    resource_type: 'image',
                    transformation: options.transformation,
                },
                (error, result) => {
                    if (error) {
                        logger.error('Cloudinary upload error', { error });
                        return reject(error);
                    }
                    if (!result) {
                        return reject(new Error('Cloudinary upload returned no result'));
                    }
                    resolve(result as CloudinaryUploadResult);
                }
            );

            uploadStream.end(buffer);
        });
    }

    async uploadVideo(
        buffer: Buffer,
        fileName: string,
        options: { folder: string; transformation?: TransformationOption[] }
    ): Promise<CloudinaryUploadResult> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    public_id: fileName,
                    folder: options.folder,
                    resource_type: 'video',
                    transformation: options.transformation,
                },
                (error, result) => {
                    if (error) {
                        logger.error('Cloudinary video upload error', { error });
                        return reject(error);
                    }
                    if (!result) {
                        return reject(new Error('Cloudinary upload returned no result'));
                    }
                    resolve(result as CloudinaryUploadResult);
                }
            );

            uploadStream.end(buffer);
        });
    }

    async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        } catch (error) {
            logger.error('Cloudinary delete error', { error, publicId });
            throw error;
        }
    }

    async generateVideoThumbnail(
        publicId: string,
        options: TransformationOption
    ): Promise<string> {
        return cloudinary.url(publicId, {
            resource_type: 'video',
            transformation: [{ ...options, format: 'jpg' }],
        });
    }

    getOptimizedImageUrl(publicId: string, transformation: TransformationOption[]): string {
        return cloudinary.url(publicId, {
            resource_type: 'image',
            transformation,
        });
    }

    getOptimizedVideoUrl(publicId: string, transformation: TransformationOption[]): string {
        return cloudinary.url(publicId, {
            resource_type: 'video',
            transformation,
        });
    }
}

export const cloudinaryService = new CloudinaryService();
