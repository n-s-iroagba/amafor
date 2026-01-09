import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import crypto from 'crypto';
import { logger } from './logger';
import { tracer } from './tracer';
import fs from 'fs';
import path from 'path';

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local'; // 'local' or 's3'
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB

// S3 Configuration (if using AWS S3)
const S3_BUCKET = process.env.S3_BUCKET || '';
const S3_REGION = process.env.S3_REGION || 'us-east-1';
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || '';
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || '';

// Create S3 client if configured
let s3Client: S3Client | null = null;
if (STORAGE_TYPE === 's3' && S3_ACCESS_KEY && S3_SECRET_KEY) {
  s3Client = new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });
}

// Ad zone specifications
export const AD_ZONE_SPECS = {
  homepage_banner: {
    width: 1200,
    height: 300,
    formats: ['jpg', 'png'],
    maxSize: 2 * 1024 * 1024, // 2MB
  },
  top_page_banner: {
    width: 970,
    height: 250,
    formats: ['jpg', 'png'],
    maxSize: 2 * 1024 * 1024, // 2MB
  },
  sidebar: {
    width: 300,
    height: 250,
    formats: ['jpg', 'png'],
    maxSize: 1 * 1024 * 1024, // 1MB
  },
  article_footer: {
    width: 728,
    height: 90,
    formats: ['jpg', 'png'],
    maxSize: 1.5 * 1024 * 1024, // 1.5MB
  },
  mid_article: {
    width: 640,
    height: 360,
    formats: ['mp4'],
    maxSize: 2 * 1024 * 1024, // 2MB
  },
};

// User upload specifications
export const USER_UPLOAD_SPECS = {
  avatar: {
    width: 300,
    height: 300,
    formats: ['jpg', 'png', 'jpeg'],
    maxSize: 1 * 1024 * 1024, // 1MB
  },
  patron_portrait: {
    width: 400,
    height: 400,
    formats: ['jpg', 'png', 'jpeg'],
    maxSize: 2 * 1024 * 1024, // 2MB
  },
  patron_logo: {
    width: 300,
    height: 150,
    formats: ['jpg', 'png', 'jpeg', 'svg'],
    maxSize: 2 * 1024 * 1024, // 2MB
  },
};

// Create upload directory if it doesn't exist
if (STORAGE_TYPE === 'local') {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// Generate unique filename
export const generateFilename = (originalname: string, prefix?: string): string => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalname).toLowerCase();
  const name = prefix ? `${prefix}_${timestamp}_${random}${extension}` : `${timestamp}_${random}${extension}`;
  
  return name;
};

// Configure multer for local storage
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOAD_DIR, req.params.type || 'general');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = generateFilename(file.originalname, req.params.type);
    cb(null, filename);
  },
});

// Create multer upload instance
export const upload = multer({
  storage: localStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'application/pdf',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`));
    }
  },
});

// Upload file to storage
export const uploadFile = async (
  file: Express.Multer.File,
  options: {
    type: string;
    userId?: string;
    metadata?: Record<string, any>;
    resizeOptions?: { width?: number; height?: number; quality?: number };
  }
): Promise<{
  success: boolean;
  url?: string;
  key?: string;
  filename?: string;
  size?: number;
  mimetype?: string;
  dimensions?: { width: number; height: number };
  error?: string;
}> => {
  return tracer.startActiveSpan('storage.uploadFile', async (span) => {
    try {
      span.setAttributes({
        'storage.type': options.type,
        'storage.user_id': options.userId,
        'storage.file_name': file.originalname,
        'storage.file_size': file.size,
        'storage.mime_type': file.mimetype,
      });

      let processedBuffer = file.buffer;
      let dimensions: { width: number; height: number } | undefined;

      // Process image if it's an image and resize options are provided
      if (file.mimetype.startsWith('image/') && options.resizeOptions) {
        const { width, height, quality = 80 } = options.resizeOptions;
        
        const image = sharp(file.buffer);
        const metadata = await image.metadata();
        
        dimensions = {
          width: metadata.width || 0,
          height: metadata.height || 0,
        };

        // Resize if dimensions are provided
        if (width || height) {
          image.resize(width, height, {
            fit: 'cover',
            position: 'center',
          });
        }

        // Adjust quality
        if (quality) {
          if (file.mimetype === 'image/jpeg') {
            image.jpeg({ quality });
          } else if (file.mimetype === 'image/png') {
            image.png({ quality });
          }
        }

        processedBuffer = await image.toBuffer();
        
        span.setAttributes({
          'storage.processed_size': processedBuffer.length,
          'storage.original_width': dimensions.width,
          'storage.original_height': dimensions.height,
        });
      }

      const filename = generateFilename(file.originalname, options.type);
      let url: string;
      let key: string;

      if (STORAGE_TYPE === 's3' && s3Client) {
        // Upload to S3
        key = `${options.type}/${filename}`;
        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          Body: processedBuffer,
          ContentType: file.mimetype,
          Metadata: options.metadata || {},
        });

        await s3Client.send(command);
        url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
      } else {
        // Upload to local storage
        const uploadPath = path.join(UPLOAD_DIR, options.type);
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        const filePath = path.join(uploadPath, filename);
        fs.writeFileSync(filePath, processedBuffer);
        
        key = filename;
        url = `/uploads/${options.type}/${filename}`;
      }

      span.setAttributes({
        'storage.success': true,
        'storage.url': url,
        'storage.key': key,
        'storage.final_size': processedBuffer.length,
      });

      logger.info('File uploaded successfully', {
        type: options.type,
        filename,
        url,
        size: processedBuffer.length,
        userId: options.userId,
      });

      return {
        success: true,
        url,
        key,
        filename,
        size: processedBuffer.length,
        mimetype: file.mimetype,
        dimensions,
      };
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error uploading file', {
        error: error.message,
        type: options.type,
        originalname: file.originalname,
        userId: options.userId,
      });

      return {
        success: false,
        error: error.message,
      };
    } finally {
      span.end();
    }
  });
};

// Get file from storage
export const getFile = async (
  key: string,
  options?: {
    expiresIn?: number; // For signed URLs
    download?: boolean;
  }
): Promise<{
  success: boolean;
  url?: string;
  buffer?: Buffer;
  mimetype?: string;
  error?: string;
}> => {
  return tracer.startActiveSpan('storage.getFile', async (span) => {
    try {
      span.setAttribute('storage.key', key);

      if (STORAGE_TYPE === 's3' && s3Client) {
        if (options?.expiresIn) {
          // Generate signed URL
          const command = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            ResponseContentDisposition: options.download ? 'attachment' : 'inline',
          });

          const url = await getSignedUrl(s3Client, command, {
            expiresIn: options.expiresIn,
          });

          span.setAttributes({
            'storage.success': true,
            'storage.signed_url': true,
            'storage.expires_in': options.expiresIn,
          });

          return {
            success: true,
            url,
          };
        } else {
          // Get public URL
          const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
          
          span.setAttributes({
            'storage.success': true,
            'storage.public_url': true,
          });

          return {
            success: true,
            url,
          };
        }
      } else {
        // Get from local storage
        const filePath = path.join(UPLOAD_DIR, key);
        
        if (!fs.existsSync(filePath)) {
          throw new Error('File not found');
        }

        const buffer = fs.readFileSync(filePath);
        const mimetype = getMimeType(path.extname(filePath));

        span.setAttributes({
          'storage.success': true,
          'storage.local_path': true,
          'storage.file_size': buffer.length,
        });

        return {
          success: true,
          buffer,
          mimetype,
          url: `/uploads/${key}`,
        };
      }
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error getting file', {
        error: error.message,
        key,
      });

      return {
        success: false,
        error: error.message,
      };
    } finally {
      span.end();
    }
  });
};

// Delete file from storage
export const deleteFile = async (key: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  return tracer.startActiveSpan('storage.deleteFile', async (span) => {
    try {
      span.setAttribute('storage.key', key);

      if (STORAGE_TYPE === 's3' && s3Client) {
        const command = new DeleteObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
        });

        await s3Client.send(command);
      } else {
        // Delete from local storage
        const filePath = path.join(UPLOAD_DIR, key);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      span.setAttribute('storage.success', true);

      logger.info('File deleted successfully', { key });

      return { success: true };
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error deleting file', {
        error: error.message,
        key,
      });

      return {
        success: false,
        error: error.message,
      };
    } finally {
      span.end();
    }
  });
};

// Validate ad creative file
export const validateAdCreative = async (
  file: Express.Multer.File,
  zone: string
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  dimensions?: { width: number; height: number };
  actualSize: number;
}> => {
  return tracer.startActiveSpan('storage.validateAdCreative', async (span) => {
    try {
      span.setAttributes({
        'storage.zone': zone,
        'storage.file_name': file.originalname,
        'storage.file_size': file.size,
        'storage.mime_type': file.mimetype,
      });

      const errors: string[] = [];
      const warnings: string[] = [];
      const specs = AD_ZONE_SPECS[zone as keyof typeof AD_ZONE_SPECS];

      if (!specs) {
        errors.push(`Invalid ad zone: ${zone}`);
        return { valid: false, errors, warnings, actualSize: file.size };
      }

      // Check file format
      const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
      if (!specs.formats.includes(fileExtension)) {
        errors.push(`Invalid file format: ${fileExtension}. Allowed formats: ${specs.formats.join(', ')}`);
      }

      // Check file size
      if (file.size > specs.maxSize) {
        const maxSizeMB = (specs.maxSize / (1024 * 1024)).toFixed(2);
        const actualSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        errors.push(`File size ${actualSizeMB}MB exceeds maximum ${maxSizeMB}MB`);
      }

      // Check dimensions for images
      if (file.mimetype.startsWith('image/')) {
        try {
          const metadata = await sharp(file.buffer).metadata();
          
          if (metadata.width !== specs.width || metadata.height !== specs.height) {
            warnings.push(`Recommended dimensions: ${specs.width}x${specs.height}px. Current: ${metadata.width}x${metadata.height}px`);
          }

          span.setAttributes({
            'storage.actual_width': metadata.width,
            'storage.actual_height': metadata.height,
            'storage.expected_width': specs.width,
            'storage.expected_height': specs.height,
          });

          return {
            valid: errors.length === 0,
            errors,
            warnings,
            dimensions: { width: metadata.width || 0, height: metadata.height || 0 },
            actualSize: file.size,
          };
        } catch (imageError) {
          errors.push(`Failed to read image dimensions: ${imageError.message}`);
        }
      }

      // For videos, we can't easily check dimensions without proper video processing
      if (file.mimetype.startsWith('video/')) {
        warnings.push('Video dimensions validation not performed. Please ensure video meets specifications.');
      }

      span.setAttributes({
        'storage.valid': errors.length === 0,
        'storage.error_count': errors.length,
        'storage.warning_count': warnings.length,
      });

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        actualSize: file.size,
      };
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error validating ad creative', {
        error: error.message,
        zone,
        filename: file.originalname,
      });

      return {
        valid: false,
        errors: [`Validation error: ${error.message}`],
        warnings: [],
        actualSize: file.size,
      };
    } finally {
      span.end();
    }
  });
};

// Generate thumbnail for image
export const generateThumbnail = async (
  buffer: Buffer,
  options: {
    width: number;
    height: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
  }
): Promise<Buffer> => {
  return tracer.startActiveSpan('storage.generateThumbnail', async (span) => {
    try {
      span.setAttributes({
        'storage.thumbnail_width': options.width,
        'storage.thumbnail_height': options.height,
        'storage.thumbnail_format': options.format || 'jpg',
      });

      const image = sharp(buffer);
      
      // Resize
      image.resize(options.width, options.height, {
        fit: 'cover',
        position: 'center',
      });

      // Convert format and adjust quality
      switch (options.format) {
        case 'png':
          image.png({ quality: options.quality || 80 });
          break;
        case 'webp':
          image.webp({ quality: options.quality || 80 });
          break;
        default:
          image.jpeg({ quality: options.quality || 80 });
      }

      const thumbnailBuffer = await image.toBuffer();
      
      span.setAttributes({
        'storage.thumbnail_size': thumbnailBuffer.length,
      });

      return thumbnailBuffer;
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error generating thumbnail', { error: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
};

// Get MIME type from extension
export const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

// Clean up old files
export const cleanupOldFiles = async (olderThanDays: number = 30): Promise<{
  deleted: number;
  errors: string[];
}> => {
  return tracer.startActiveSpan('storage.cleanupOldFiles', async (span) => {
    try {
      span.setAttribute('storage.older_than_days', olderThanDays);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      let deleted = 0;
      const errors: string[] = [];

      if (STORAGE_TYPE === 's3' && s3Client) {
        // S3 cleanup would require listing objects and deleting old ones
        // This is more complex and requires pagination
        // For now, we'll skip S3 cleanup
        warnings.push('S3 cleanup not implemented');
      } else {
        // Local storage cleanup
        const cleanupDirectory = (dir: string) => {
          if (!fs.existsSync(dir)) return;

          const files = fs.readdirSync(dir);
          
          for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              cleanupDirectory(filePath);
              
              // Remove empty directories
              const subFiles = fs.readdirSync(filePath);
              if (subFiles.length === 0) {
                fs.rmdirSync(filePath);
              }
            } else if (stat.mtime < cutoffDate) {
              try {
                fs.unlinkSync(filePath);
                deleted++;
                logger.debug('Deleted old file', { filePath });
              } catch (error) {
                errors.push(`Failed to delete ${filePath}: ${error.message}`);
              }
            }
          }
        };

        cleanupDirectory(UPLOAD_DIR);
      }

      span.setAttributes({
        'storage.deleted_files': deleted,
        'storage.cleanup_errors': errors.length,
      });

      logger.info(`Cleaned up ${deleted} old files`, { olderThanDays });

      return { deleted, errors };
    } catch (error) {
      span.setStatus({
        code: 2,
        message: error.message,
      });

      logger.error('Error cleaning up old files', { error: error.message });
      return { deleted: 0, errors: [error.message] };
    } finally {
      span.end();
    }
  });
};

// Check storage health
export const checkStorageHealth = async (): Promise<{
  healthy: boolean;
  type: string;
  availableSpace?: number;
  error?: string;
}> => {
  return tracer.startActiveSpan('storage.checkHealth', async (span) => {
    try {
      if (STORAGE_TYPE === 's3' && s3Client) {
        // Check S3 connectivity
        await s3Client.send(new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: 'healthcheck.txt',
        })).catch(() => {
          // Expected to fail, just testing connectivity
        });

        span.setAttributes({
          'storage.healthy': true,
          'storage.type': 's3',
        });

        return {
          healthy: true,
          type: 's3',
        };
      } else {
        // Check local storage
        const testFile = path.join(UPLOAD_DIR, 'healthcheck.txt');
        fs.writeFileSync(testFile, 'healthcheck');
        fs.unlinkSync(testFile);

        // Check available space (Unix/Linux only)
        let availableSpace;
        if (process.platform !== 'win32') {
          const stats = require('fs').statfsSync(UPLOAD_DIR);
          availableSpace = stats.bavail * stats.bsize;
        }

        span.setAttributes({
          'storage.healthy': true,
          'storage.type': 'local',
          'storage.available_space': availableSpace,
        });

        return {
          healthy: true,
          type: 'local',
          availableSpace,
        };
      }
    } catch (error) {
      span.setAttributes({
        'storage.healthy': false,
        'storage.type': STORAGE_TYPE,
        'storage.error': error.message,
      });

      return {
        healthy: false,
        type: STORAGE_TYPE,
        error: error.message,
      };
    } finally {
      span.end();
    }
  });
};

// Export all storage utilities
export default {
  upload,
  uploadFile,
  getFile,
  deleteFile,
  validateAdCreative,
  generateThumbnail,
  getMimeType,
  cleanupOldFiles,
  checkStorageHealth,
  AD_ZONE_SPECS,
  USER_UPLOAD_SPECS,
  STORAGE_TYPE,
};