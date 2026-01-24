"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryService = exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class CloudinaryService {
    async uploadImage(buffer, fileName, options) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                public_id: fileName,
                folder: options.folder,
                resource_type: 'image',
                transformation: options.transformation,
            }, (error, result) => {
                if (error) {
                    logger_1.default.error('Cloudinary upload error', { error });
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary upload returned no result'));
                }
                resolve(result);
            });
            uploadStream.end(buffer);
        });
    }
    async uploadVideo(buffer, fileName, options) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                public_id: fileName,
                folder: options.folder,
                resource_type: 'video',
                transformation: options.transformation,
            }, (error, result) => {
                if (error) {
                    logger_1.default.error('Cloudinary video upload error', { error });
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary upload returned no result'));
                }
                resolve(result);
            });
            uploadStream.end(buffer);
        });
    }
    async deleteFile(publicId, resourceType = 'image') {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType });
        }
        catch (error) {
            logger_1.default.error('Cloudinary delete error', { error, publicId });
            throw error;
        }
    }
    async generateVideoThumbnail(publicId, options) {
        return cloudinary_1.v2.url(publicId, {
            resource_type: 'video',
            transformation: [{ ...options, format: 'jpg' }],
        });
    }
    getOptimizedImageUrl(publicId, transformation) {
        return cloudinary_1.v2.url(publicId, {
            resource_type: 'image',
            transformation,
        });
    }
    getOptimizedVideoUrl(publicId, transformation) {
        return cloudinary_1.v2.url(publicId, {
            resource_type: 'video',
            transformation,
        });
    }
}
exports.CloudinaryService = CloudinaryService;
exports.cloudinaryService = new CloudinaryService();
//# sourceMappingURL=cloudinary.js.map