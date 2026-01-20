'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageIcon, Upload, X } from 'lucide-react';
import { usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { uploadFile } from '@/shared/utils';
import Image from 'next/image';


export default function NewCoach() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const { post, isPending: isSubmitting } = usePost(API_ROUTES.COACHES.CREATE);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!role.trim()) newErrors.role = 'Role is required';
    if (!imageUrl) newErrors.imageUrl = 'Coach image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: 'Please select a valid image file',
        }));
        return;
      }
      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: 'Image must be smaller than 5MB',
        }));
        return;
      }

      setUploadProgress(10); // fake start progress
      const url = await uploadFile(file, 'image');
      setUploadProgress(100);

      setImageFile(file);
      setImageUrl(url);
      setErrors((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await post({
        name,
        role,
        bio: bio || null,
        imageUrl,
      });

      if (result) {
        router.push('/sports-admin/coach');
      } else {
        console.error('Failed to create coach');
      }
    } catch (error) {
      console.error('Error creating coach:', error);
    } finally {
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 border-b border-sky-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Add New Coach
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Add a new coach to the team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Name & Role */}
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
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-sky-300'
                  } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-sky-700"
              >
                Role *
              </label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.role ? 'border-red-500' : 'border-sky-300'
                  } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Bio */}
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
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Coach Image *
            </label>
            <div
              onClick={() => imageInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${imageFile
                  ? 'border-green-300 bg-green-50'
                  : errors.imageUrl
                    ? 'border-red-300 bg-red-50'
                    : 'border-sky-300 bg-sky-50 hover:border-sky-400'
                }`}
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imageFile ? (
                <div className="space-y-2">
                  <Image
                    height={50}
                    width={50}
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mx-auto"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImageUrl('');
                      if (imageInputRef.current) {
                        imageInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="w-12 h-12 text-sky-400 mx-auto" />
                  <div>
                    <p className="text-sky-600 font-medium">
                      Click to upload image
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-sky-600 mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-sky-300 rounded-md shadow-sm text-sm font-medium text-sky-700 hover:bg-sky-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !imageUrl}
              className="px-4 py-2 bg-sky-600 rounded-md text-white font-medium hover:bg-sky-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" /> Adding...
                </>
              ) : (
                'Add Coach'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
