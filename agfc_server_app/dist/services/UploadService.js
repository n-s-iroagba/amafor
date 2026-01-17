"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadService = exports.UploadService = void 0;
// services/uploadService.ts
const cloudinary_1 = require("../cloudinary");
class UploadService {
    /**
     * Upload image file
     */
    async uploadImage(file) {
        try {
            // Validate file type
            if (!file.mimetype.startsWith('image/')) {
                throw new Error('Invalid file type. Only images are allowed.');
            }
            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 5MB.');
            }
            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileName = `${timestamp}_${randomString}`;
            // Upload to Cloudinary
            const result = await cloudinary_1.cloudinaryService.uploadImage(file.buffer, fileName, {
                folder: 'video-app/thumbnails',
                transformation: [
                    { quality: 'auto:best' },
                    { fetch_format: 'auto' },
                    { width: 800, height: 600, crop: 'limit' }
                ]
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                bytes: result.bytes,
                width: result.width,
                height: result.height,
                resourceType: 'image'
            };
        }
        catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Upload video file
     */
    async uploadVideo(file) {
        try {
            // Validate file type
            if (!file.mimetype.startsWith('video/')) {
                throw new Error('Invalid file type. Only videos are allowed.');
            }
            // Validate file size (100MB limit)
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 100MB.');
            }
            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileName = `${timestamp}_${randomString}`;
            // Upload to Cloudinary
            const result = await cloudinary_1.cloudinaryService.uploadVideo(file.buffer, fileName, {
                folder: 'video-app/videos',
                transformation: [
                    { quality: 'auto:best' },
                    { fetch_format: 'auto' }
                ]
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                bytes: result.bytes,
                width: result.width,
                height: result.height,
                duration: result.duration,
                resourceType: 'video'
            };
        }
        catch (error) {
            console.error('Error uploading video:', error);
            throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Delete file from Cloudinary
     */
    async deleteFile(publicId, resourceType = 'image') {
        try {
            await cloudinary_1.cloudinaryService.deleteFile(publicId, resourceType);
        }
        catch (error) {
            console.error('Error deleting file:', error);
            throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Generate video thumbnail from uploaded video
     */
    async generateVideoThumbnail(videoPublicId, options = {}) {
        try {
            return await cloudinary_1.cloudinaryService.generateVideoThumbnail(videoPublicId, {
                width: options.width || 800,
                height: options.height || 600,
                crop: 'fill',
                gravity: 'center',
                start_offset: options.timeOffset || '2' // 2 seconds into the video
            });
        }
        catch (error) {
            console.error('Error generating thumbnail:', error);
            throw new Error(`Failed to generate thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get optimized URLs for different screen sizes
     */
    getResponsiveImageUrls(publicId) {
        return {
            thumbnail: cloudinary_1.cloudinaryService.getOptimizedImageUrl(publicId, [
                { width: 300, height: 200, crop: 'fill' }
            ]),
            small: cloudinary_1.cloudinaryService.getOptimizedImageUrl(publicId, [
                { width: 600, height: 400, crop: 'fill' }
            ]),
            medium: cloudinary_1.cloudinaryService.getOptimizedImageUrl(publicId, [
                { width: 1200, height: 800, crop: 'fill' }
            ]),
            large: cloudinary_1.cloudinaryService.getOptimizedImageUrl(publicId, [
                { width: 1920, height: 1080, crop: 'fill' }
            ])
        };
    }
    /**
     * Get optimized video URLs for different qualities
     */
    getResponsiveVideoUrls(publicId) {
        return {
            low: cloudinary_1.cloudinaryService.getOptimizedVideoUrl(publicId, [
                { quality: 'auto:low', width: 640, height: 360 }
            ]),
            medium: cloudinary_1.cloudinaryService.getOptimizedVideoUrl(publicId, [
                { quality: 'auto:good', width: 1280, height: 720 }
            ]),
            high: cloudinary_1.cloudinaryService.getOptimizedVideoUrl(publicId, [
                { quality: 'auto:best', width: 1920, height: 1080 }
            ])
        };
    }
}
exports.UploadService = UploadService;
exports.uploadService = new UploadService();
//# sourceMappingURL=UploadService.js.map