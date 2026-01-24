// app/match-images/new/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import { API_ROUTES } from '@/config/routes';

import { usePost } from '@/shared/hooks/useApiQuery';
import { uploadFile } from '@/shared/utils';


interface FixtureImageCreationAttributes {
  fixtureId: number;
  imageUrl: string;
  caption?: string;
}


/**
 * Page: Upload Fixture Image
 * Description: Form to upload new photos for a fixture.
 * Requirements: REQ-ADM-08 (Fixture Images)
 * User Story: US-ADM-008 (Manage Fixture Images)
 * User Journey: UJ-ADM-002 (Manage Fixtures)
 * API: POST /fixtures/gallery (API_ROUTES.FIXTURES.GALLERY)
 */
export default function BulkUploadFixtureImages() {
  const router = useRouter();
  const params = useParams();
  const fixtureId = params.fixtureId as string;

  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const { post, isPending: isSubmitting } = usePost(
    API_ROUTES.MATCH_GALLERY.CREATE(fixtureId)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Initialize captions for new files
      const newCaptions = { ...captions };
      const newProgress = { ...uploadProgress };
      newFiles.forEach((file) => {
        if (!newCaptions[file.name]) {
          newCaptions[file.name] = '';
        }
        if (!newProgress[file.name]) {
          newProgress[file.name] = 0;
        }
      });
      setCaptions(newCaptions);
      setUploadProgress(newProgress);
    }
  };

  const handleCaptionChange = (fileName: string, caption: string) => {
    setCaptions((prev) => ({ ...prev, [fileName]: caption }));
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setCaptions((prev) => {
      const newCaptions = { ...prev };
      delete newCaptions[fileName];
      return newCaptions;
    });
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fixtureId) newErrors.fixtureId = 'Fixture is required';
    if (files.length === 0) newErrors.files = 'At least one image is required';

    // Validate file types and sizes
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        newErrors.files = 'All files must be images';
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        newErrors.files = 'Each image must be less than 5MB';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUploading(true);

    try {
      // Upload all images first
      const uploadPromises = files.map(async (file) => {
        try {
          const imageUrl = await uploadFile(file, 'image');
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

          // Create match image payload
          const fixtureImageData: FixtureImageCreationAttributes = {
            fixtureId: parseInt(fixtureId),
            imageUrl: imageUrl,
            caption: captions[file.name]?.trim() || undefined
          };

          return fixtureImageData;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          throw error;
        }
      });

      // Wait for all uploads to complete
      const fixtureImagesData = await Promise.all(uploadPromises);

      // Send bulk create request with proper payload
      await post({ images: fixtureImagesData });

      router.push(`/sports-admin/fixtures/${fixtureId}`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to upload images. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 border-b border-sky-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Bulk Upload Fixture Images
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Upload multiple images for fixture #{fixtureId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-sky-700"
            >
              Images *
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.files ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
            />
            {errors.files && (
              <p className="mt-1 text-sm text-red-600">{errors.files}</p>
            )}
            <p className="mt-1 text-xs text-sky-500">
              Select multiple images (JPEG, PNG, GIF). Max 5MB per image.
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-sky-800">
                Selected Images ({files.length})
              </h3>

              {/* Upload Progress */}
              {isSubmitting && (
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-sky-800 mb-2">
                    Upload Progress
                  </h4>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div key={file.name} className="flex items-center gap-3">
                        <span className="text-xs text-sky-700 truncate flex-1">
                          {file.name}
                        </span>
                        <div className="w-24 bg-sky-200 rounded-full h-2">
                          <div
                            className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.name] || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-sky-700 w-8">
                          {uploadProgress[file.name] || 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="border border-sky-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-sky-900 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.name)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mb-2">
                      <Image
                        width={200}
                        height={150}
                        unoptimized
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-sky-700 mb-1">
                        Caption (optional)
                      </label>
                      <input
                        type="text"
                        value={captions[file.name] || ''}
                        onChange={(e) =>
                          handleCaptionChange(file.name, e.target.value)
                        }
                        disabled={isSubmitting}
                        className="w-full rounded-md border border-sky-300 p-2 text-sm focus:border-sky-500 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter caption..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-4 py-2 border border-sky-300 rounded-md shadow-sm text-sm font-medium text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mt-2 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || files.length === 0}
              className="px-4 py-2 bg-sky-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}