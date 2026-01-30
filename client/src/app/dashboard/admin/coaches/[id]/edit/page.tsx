'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, ImageIcon, Upload } from 'lucide-react';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

import Image from 'next/image';
import { uploadFile } from '@/shared/utils';



interface Coach {
  id: number;
  name: string;
  role: string;
  imageUrl?: string;
  bio?: string;
}


/**
 * Page: Edit Coach
 * Description: Admin form to modify coach profile details.
 * Requirements: REQ-ADM-09 (Staff Management)
 * User Story: US-ADM-011 (Update Coach)
 * User Journey: UJ-ADM-006 (Team Management)
 * API: PUT /coaches/:id (API_ROUTES.COACHES.MUTATE)
 */
export default function EditCoach() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: coach, loading } = useGet<Coach>(
    API_ROUTES.COACHES.VIEW(id)
  );

  const { put, isPending: isSubmitting } = usePut(
    API_ROUTES.COACHES.MUTATE(id)
  );

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (coach) {
      setName(coach.name);
      setRole(coach.role);
      setBio(coach.bio || '');
      setImageUrl(coach.imageUrl || '');
    }
  }, [coach]);

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
      // type & size validation
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: 'Please select a valid image file',
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: 'Image must be smaller than 5MB',
        }));
        return;
      }

      setUploadProgress(10);
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
      await put({
        name,
        role,
        bio: bio || null,
        imageUrl,
      });

      router.push('/dashboard/admin/coaches');
    } catch (error) {
      console.error('Error updating coach:', error);
    } finally {
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sky-700 bg-sky-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-6 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-sky-800 mb-4">Edit Coach</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sky-700">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.name ? 'border-red-500' : 'border-sky-300'
                  }`}
                data-testid="input-coach-name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-700">
                Role *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.role ? 'border-red-500' : 'border-sky-300'
                  }`}
                data-testid="input-coach-role"
              />
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-sky-700">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-sky-300 p-2"
              data-testid="textarea-coach-bio"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Coach Image *
            </label>
            <div
              onClick={() => imageInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${imageFile
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

              {imageUrl ? (
                <div className="relative">
                  <Image
                    width={50}
                    height={50}
                    src={imageUrl}
                    alt={name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    unoptimized={true}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImageUrl('');
                      if (imageInputRef.current)
                        imageInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="w-12 h-12 text-sky-400 mx-auto" />
                  <p className="text-sky-600 font-medium">
                    Click to upload image
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-sky-600 mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {errors.imageUrl && (
              <p className="text-sm text-red-600">{errors.imageUrl}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-sky-300 rounded-md text-sky-700 hover:bg-sky-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !imageUrl}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 flex items-center"
              data-testid="btn-update-coach"
            >
              {isSubmitting ? (
                <Upload className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isSubmitting ? 'Updating...' : 'Update Coach'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
