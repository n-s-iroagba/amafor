// app/videos/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Video,
  Image as ImageIcon,
  Clock,
  FileText,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import api from '@/shared/lib/axios';
import { API_ROUTES } from '@/config/routes';
import { uploadFile } from '@/shared/utils';
import Image from 'next/image';


export default function NewVideo() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [duration, setDuration] = useState('');
  
  // File states
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, video: 'Please select a valid video file (MP4, WebM, OGG, MOV)' }));
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, video: 'Video size must be less than 500MB' }));
      return;
    }

    setSelectedVideo(file);
    setErrors(prev => ({ ...prev, video: '' }));
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, thumbnail: 'Please select a valid image file (JPEG, PNG, WebP, GIF)' }));
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, thumbnail: 'Image size must be less than 10MB' }));
      return;
    }

    setSelectedThumbnail(file);
    setErrors(prev => ({ ...prev, thumbnail: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeThumbnail = () => {
    setSelectedThumbnail(null);
    setThumbnailPreview('');
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const handleUpload = async (file: File, type: 'image' | 'video'): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadedUrl = await uploadFile(file, type);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return uploadedUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload ${type}. Please try again.`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Video title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = 'Video description is required';
    } else if (excerpt.length > 500) {
      newErrors.excerpt = 'Description must be less than 500 characters';
    }

    if (!selectedVideo) {
      newErrors.video = 'Please select a video file';
    }

    if (!selectedThumbnail) {
      newErrors.thumbnail = 'Please select a thumbnail image';
    }

    if (duration && (parseInt(duration) < 1 || parseInt(duration) > 1440)) {
      newErrors.duration = 'Duration must be between 1 and 1440 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Upload files to Cloudinary
      const [videoUrl, thumbnailUrl] = await Promise.all([
        handleUpload(selectedVideo!, 'video'),
        handleUpload(selectedThumbnail!, 'image'),
      ]);

      // Create video record
      const response = await api.post(API_ROUTES.VIDEOS.CREATE, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        videoUrl,
        thumbnail: thumbnailUrl,
        duration: duration ? parseInt(duration) : null,
      });

      if (response && response.data) {
        setSuccess('Video created successfully!');
        setTimeout(() => {
          router.push('/sports-admin/videos');
        }, 1500);
      } else {
        setErrors({ general: 'Failed to create video. Please try again.' });
      }
    } catch (error: any) {
      console.error('Error creating video:', error);
      setErrors({ 
        general: error.message || 'Failed to create video. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            href="/sports-admin/videos"
            className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors p-2 rounded-lg hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-800">
              Add New Video
            </h1>
            <p className="text-sky-600 mt-1">Upload and create a new video</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - 2/3 width */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">{success}</p>
                  </div>
                </motion.div>
              )}

              {/* General Error Message */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700">{errors.general}</p>
                  </div>
                </motion.div>
              )}

              {/* Video Title */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  Video Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter a descriptive title for your video"
                  maxLength={200}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">
                    A clear, descriptive title helps viewers find your video
                  </p>
                  <span className="text-xs text-gray-400">{title.length}/200</span>
                </div>
              </div>

              {/* Video Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  Video Description *
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    if (errors.excerpt) setErrors(prev => ({ ...prev, excerpt: '' }));
                  }}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                    errors.excerpt ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Describe what your video is about..."
                  maxLength={500}
                />
                {errors.excerpt && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.excerpt}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">
                    Provide a brief description of your video content
                  </p>
                  <span className="text-xs text-gray-400">{excerpt.length}/500</span>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    if (errors.duration) setErrors(prev => ({ ...prev, duration: '' }));
                  }}
                  min="1"
                  max="1440"
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${
                    errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter video duration in minutes (optional)"
                />
                {errors.duration && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.duration}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Optional: Video duration in minutes. Leave empty if unknown.
                </p>
              </div>

               <div className="space-y-6">
            {/* Video File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-sky-600" />
                Video File *
              </h2>
              
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoSelect}
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                className="hidden"
              />
              
              {!selectedVideo ? (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploading}
                  className={`w-full p-8 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
                    errors.video 
                      ? 'border-red-300 bg-red-50 text-red-700' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700'
                  } disabled:opacity-50`}
                >
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-60" />
                  <p className="font-medium mb-1">Choose Video File</p>
                  <p className="text-sm opacity-75">MP4, WebM, OGG, MOV</p>
                  <p className="text-xs mt-2">Max 500MB</p>
                </button>
              ) : (
                <div className="border-2 border-sky-200 bg-sky-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-sky-600" />
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {selectedVideo.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeVideo}
                      disabled={isUploading}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formatFileSize(selectedVideo.size)}
                  </p>
                </div>
              )}
              
              {errors.video && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.video}
                </p>
              )}
            </motion.div>

            {/* Thumbnail Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-sky-600" />
                Thumbnail Image *
              </h2>
              
              <input
                type="file"
                ref={thumbnailInputRef}
                onChange={handleThumbnailSelect}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
              />
              
              {!selectedThumbnail ? (
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={isUploading}
                  className={`w-full p-8 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
                    errors.thumbnail 
                      ? 'border-red-300 bg-red-50 text-red-700' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700'
                  } disabled:opacity-50`}
                >
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-60" />
                  <p className="font-medium mb-1">Choose Thumbnail</p>
                  <p className="text-sm opacity-75">JPEG, PNG, WebP, GIF</p>
                  <p className="text-xs mt-2">Max 10MB</p>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-sky-200 bg-sky-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-sky-600" />
                        <span className="font-medium text-sm text-gray-900 truncate">
                          {selectedThumbnail.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        disabled={isUploading}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(selectedThumbnail.size)}
                    </p>
                  </div>
                  
                  {/* Thumbnail Preview */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      unoptimized
                      width={50}
                      height={50}
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              )}
              
              {errors.thumbnail && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.thumbnail}
                </p>
              )}
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-sky-50 border border-sky-200 rounded-xl p-6"
            >
              <h3 className="text-sm font-semibold text-sky-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Upload Tips
              </h3>
              <ul className="text-sm text-sky-700 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Videos should be in MP4 format for best compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Thumbnail images should be at least 1280x720 pixels</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Upload may take several minutes for large files</span>
                </li>
              </ul>
            </motion.div>
          </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>
                      {isUploading ? 'Uploading Files...' : 'Creating Video...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Video</span>
                  </>
                )}
              </motion.button>

              {/* Upload Progress */}
              {(isUploading || uploadProgress > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-sky-600" />
                    Upload Progress
                  </h3>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-sky-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 text-center">
                      {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Processing...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.form>
          </div>

          {/* File Upload Sidebar - 1/3 width */}
         
        </div>
      </div>
    </div>
  );
}