// app/players/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/apiUtils';
import { API_ROUTES } from '@/config/routes';
import { uploadFile } from '@/utils/utils';
import Image from 'next/image';

export default function NewPlayer() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPEG, PNG, WebP, GIF)' }));
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, image: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (): Promise<string> => {
    if (!selectedFile) {
      return imageUrl; // Return existing URL if no new file selected
    }

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

      const uploadedUrl = await uploadFile(selectedFile, 'image');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return uploadedUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to upload image. Please try again.' }));
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!position.trim()) newErrors.position = 'Position is required';
    if (!jerseyNumber.trim())
      newErrors.jerseyNumber = 'Jersey number is required';
    else if (parseInt(jerseyNumber) < 1 || parseInt(jerseyNumber) > 99)
      newErrors.jerseyNumber = 'Jersey number must be between 1 and 99';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        finalImageUrl = await handleUpload();
      }

      const response = await api.post(API_ROUTES.PLAYERS.CREATE, {
        name,
        position,
        jerseyNumber: parseInt(jerseyNumber),
        imageUrl: finalImageUrl || null,
        bio: bio || null,
        dateOfBirth: dateOfBirth || null,
        nationality: nationality || null,
      });

      if (response) {
        router.push('/sports-admin/players');
        router.refresh();
      } else {
        console.error('Failed to create player');
        setErrors(prev => ({ ...prev, submit: 'Failed to create player. Please try again.' }));
      }
    } catch (error) {
      console.error('Error creating player:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to create player. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 border-b border-sky-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Add New Player
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Add a new player to the team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Player Photo
            </label>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border-2 border-dashed border-sky-300 rounded-lg overflow-hidden bg-sky-50 flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                    unoptimized
                    height={50}
                    width={50}
                      src={imagePreview}
                      alt="Player preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-sky-400 text-center p-2">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-sky-200 rounded-full h-2">
                      <div 
                        className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-sky-600 mt-1 text-center">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="hidden"
                />
                
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Choose Image
                  </button>
                  
                  {(imagePreview || imageUrl) && (
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={isUploading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="text-xs text-sky-600">
                  <p>• Supported formats: JPEG, PNG, WebP, GIF</p>
                  <p>• Maximum file size: 5MB</p>
                  <p>• Recommended: Square aspect ratio, 500x500px or larger</p>
                </div>
                
                {errors.image && (
                  <p className="text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Rest of the form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-sky-700"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.name ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Enter player name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-sky-700"
              >
                Position *
              </label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.position ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              >
                <option value="">Select position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="jerseyNumber"
                className="block text-sm font-medium text-sky-700"
              >
                Jersey Number *
              </label>
              <input
                type="number"
                id="jerseyNumber"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                min="1"
                max="99"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.jerseyNumber ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Enter jersey number"
              />
              {errors.jerseyNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.jerseyNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-sky-700"
              >
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="mt-1 block w-full rounded-md border border-sky-300 p-2 text-sm sm:text-base shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder="Enter nationality"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-sky-700"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1 block w-full rounded-md border border-sky-300 p-2 text-sm sm:text-base shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>

          {/* Removed the old Image URL input since we're using file upload now */}
          
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-sky-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-sky-300 p-2 text-sm sm:text-base shadow-sm focus:border-sky-500 focus:ring-sky-500"
              placeholder="Enter player bio"
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 border border-sky-300 rounded-md shadow-sm text-sm font-medium text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mt-2 sm:mt-0 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 bg-sky-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-75"
            >
              {isSubmitting ? 'Adding...' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}