
// app/videos/[id]/edit/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image'
import {
  ArrowLeft,
  Upload,
  Video,
  Image as ImageIcon,
  Clock,
  FileText,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
} from 'lucide-react';
import api from '@/lib/apiUtils';
import { API_ROUTES } from '@/config/routes';
import { uploadFile } from '@/utils/utils';

interface Video {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  videoUrl: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}



export default function EditVideo() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [duration, setDuration] = useState('');
  
  // File states
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  // UI states
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Fetch video data
  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  const fetchVideo = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ROUTES.VIDEOS.VIEW(id as string));
      console.log(response)
      
      if (response && response.data) {
        const videoData: Video = response.data.data;
        setVideo(videoData);
        setTitle(videoData.title);
        setExcerpt(videoData.excerpt);
        setDuration(videoData.duration?.toString() || '');
        setThumbnailPreview(videoData.thumbnail);
      } else {
        setErrors({ general: 'Failed to load video data' });
      }
    } catch (error: any) {
      console.error('Error fetching video:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to load video data. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setThumbnailPreview(video?.thumbnail || '');
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
      let videoUrl = video?.videoUrl;
      let thumbnailUrl = video?.thumbnail;

      // Upload new files if selected
      if (selectedVideo) {
        videoUrl = await handleUpload(selectedVideo, 'video');
      }

      if (selectedThumbnail) {
        thumbnailUrl = await handleUpload(selectedThumbnail, 'image');
      }

      // Update video record
      const response = await api.put(API_ROUTES.VIDEOS.MUTATE(Number(id)), {
        title: title.trim(),
        excerpt: excerpt.trim(),
        videoUrl,
        thumbnail: thumbnailUrl,
        duration: duration ? parseInt(duration) : null,
      });

      if (response && response.data) {
        setSuccess('Video updated successfully!');
        // Refresh the video data
        fetchVideo();
        // Clear selected files
        setSelectedVideo(null);
        setSelectedThumbnail(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        
        setTimeout(() => {
          router.push('/sports-admin/videos');
        }, 1500);
      } else {
        setErrors({ general: 'Failed to update video. Please try again.' });
      }
    } catch (error: any) {
      console.error('Error updating video:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update video. Please try again.' 
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

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-sky-700">Loading video data...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-sky-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sky-800 mb-2">Video Not Found</h2>
          <p className="text-sky-600 mb-4">The video you&apos;re trying to edit doesn&apos;t exist.</p>
          <Link
            href="/sports-admin/videos"
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Link>
        </div>
      </div>
    );
  }

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
              Edit Video
            </h1>
            <p className="text-sky-600 mt-1">Update video details and files</p>
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
                  <span className="text-xs text-gray-400">{title?.length}/200</span>
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
                  <span className="text-xs text-gray-400">{excerpt?.length}/500</span>
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
                {video.duration && (
                  <p className="text-gray-500 text-xs mt-2">
                    Current duration: {formatDuration(video.duration)}
                  </p>
                )}
              </div>
               <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-sky-600" />
                Update Video File
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
                  className={`w-full p-6 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
                    errors.video 
                      ? 'border-red-300 bg-red-50 text-red-700' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700'
                  } disabled:opacity-50`}
                >
                  <Video className="w-8 h-8 mx-auto mb-2 opacity-60" />
                  <p className="font-medium text-sm mb-1">Choose New Video</p>
                  <p className="text-xs opacity-75">MP4, WebM, OGG, MOV</p>
                  <p className="text-xs mt-1">Max 500MB</p>
                </button>
              ) : (
                <div className="border-2 border-sky-200 bg-sky-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-sky-600" />
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
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-sky-600" />
                Update Thumbnail
              </h2>
              
              <input
                type="file"
                ref={thumbnailInputRef}
                onChange={handleThumbnailSelect}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
              />
              
              {/* Current Thumbnail */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Thumbnail:</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    width={50}
                    height={50}
                    unoptimized
                    src={video.thumbnail}
                    alt="Current thumbnail"
                    className="w-full h-20 object-cover"
                  />
                </div>
              </div>
              
              {!selectedThumbnail ? (
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={isUploading}
                  className={`w-full p-6 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
                    errors.thumbnail 
                      ? 'border-red-300 bg-red-50 text-red-700' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700'
                  } disabled:opacity-50`}
                >
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-60" />
                  <p className="font-medium text-sm mb-1">Choose New Thumbnail</p>
                  <p className="text-xs opacity-75">JPEG, PNG, WebP, GIF</p>
                  <p className="text-xs mt-1">Max 10MB</p>
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
                  
                  {/* New Thumbnail Preview */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">New Thumbnail Preview:</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <Image
                          width={50}
                    height={50}
                    unoptimized
                        src={thumbnailPreview}
                        alt="New thumbnail preview"
                        className="w-full h-20 object-cover"
                      />
                    </div>
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

            {/* Video Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-sky-50 border border-sky-200 rounded-xl p-6"
            >
              <h3 className="text-sm font-semibold text-sky-800 mb-3">Video Information</h3>
              <div className="space-y-2 text-sm text-sky-700">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(video?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{new Date(video.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{formatDuration(video.duration)}</span>
                </div>
              </div>
            </motion.div>

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
                      {isUploading ? 'Uploading Files...' : 'Updating Video...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Video</span>
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
          <div className="space-y-6">
            {/* Current Video Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-sky-600" />
                Current Video
              </h2>
              
              <div className="space-y-3">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-32 object-contain"
                    poster={video.thumbnail}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Current video: {formatDuration(video.duration)}
                </p>
              </div>
            </motion.div>

            {/* Video File Upload */}
           
          </div>
        </div>
      </div>
    </div>
  );
}