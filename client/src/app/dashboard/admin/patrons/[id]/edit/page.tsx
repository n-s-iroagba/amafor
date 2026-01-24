'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Image from 'next/image';
import { API_ROUTES } from '@/config/routes';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';
import api from '@/shared/lib/axios';

interface Patron {
  id: number;
  name: string;
  position: string;
  imageUrl: string | null;
  bio: string | null;
}

const uploadFile = async (
  file: File,
  type: 'thumbnail' | 'video' | 'image'
) => {
  const { cloudName } = (await api.get('/videos/upload/signature')).data;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'amafor');
  formData.append('folder', 'amafor');

  const resourceType = type === 'video' ? 'video' : 'image';
  const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const uploadRes = await fetch(cloudUrl, { method: 'POST', body: formData });

  const data = await uploadRes.json();
  return data.url;
};


/**
 * Page: Edit Patron
 * Description: Form to update patron details.
 * Requirements: REQ-ADM-12 (Patron Management)
 * User Story: US-ADM-014 (Update Patron)
 * User Journey: UJ-ADM-008 (Community Relations)
 * API: PUT /patrons/:id (API_ROUTES.PATRONS.UPDATE)
 */
export default function EditPatronPage() {
  const { id } = useParams();
  const router = useRouter();
  const patronId = id as string;

  const {
    data: patron,
    loading,
    error,
  } = useGet<Patron>(API_ROUTES.PATRONS.DETAIL(Number(patronId)));

  const { put, isPending: isSubmitting } = usePut(
    API_ROUTES.PATRONS.UPDATE(Number(patronId))
  );

  const [form, setForm] = useState<Partial<Patron>>({
    name: '',
    position: '',
    imageUrl: '',
    bio: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize form with patron data when it loads
  useEffect(() => {
    if (patron) {
      setForm({
        name: patron.name,
        position: patron.position,
        imageUrl: patron.imageUrl,
        bio: patron.bio,
      });
    }
  }, [patron]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (uploadError) setUploadError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setUploadError(null);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);

    try {
      let finalImageUrl = form.imageUrl;

      // Upload image file if selected
      if (imageFile) {
        try {
          finalImageUrl = await uploadFile(imageFile, 'image');
        } catch (error) {
          console.error('Image upload failed:', error);
          setUploadError('Failed to upload image. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      // Update patron data with the uploaded image URL
      await put({
        ...form,
        imageUrl: finalImageUrl || null,
      });

      router.push('/dashboard/admin/patrons');
    } catch (error) {
      console.error('Failed to update patron:', error);
      setUploadError('Failed to update patron. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setForm((prev) => ({ ...prev, imageUrl: '' }));
    setUploadError(null);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !patron) {
    return (
      <div className="app-container">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Patron Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The patron you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push('/dashboard/admin/patrons')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Patrons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Edit Patron #{id}
      </h1>
      <p className="text-gray-600 mb-6">Update patron information</p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter patron's full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Position Field */}
        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Position *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            placeholder="Enter position or role"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.position}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Profile Image
          </label>

          {/* Image Preview */}
          {form.imageUrl && (
            <div className="mb-4">
              <div className="relative inline-block">
                <Image
                  unoptimized
                  width={50}
                  height={50}
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* File Input */}
          <div className="flex items-center gap-4">
            <label
              htmlFor="image-upload"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Choose Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-sm text-gray-500">
              {imageFile ? imageFile.name : 'No file chosen'}
            </span>
          </div>

          {/* Help text */}
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPEG, PNG, WebP. Max size: 5MB
          </p>
        </div>

        {/* Bio Field */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Enter a short biography"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.bio || ''}
            onChange={handleChange}
          />
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{uploadError}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/admin/patrons')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading || isSubmitting ? 'Updating...' : 'Update Patron'}
          </button>
        </div>
      </form>
    </div>
  );
}
