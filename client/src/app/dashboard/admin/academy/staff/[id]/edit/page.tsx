'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Upload, ImageIcon, Award, Briefcase } from 'lucide-react';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { uploadFile } from '@/shared/utils';
import Image from 'next/image';

interface AcademyStaff {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials?: string;
  imageUrl?: string;
  category?: string;
  qualifications?: string[];
  yearsOfExperience?: number;
}


/**
 * Page: Edit Staff
 * Description: Form to update academy staff details and qualifications.
 * Requirements: REQ-ACA-02 (Staff Management)
 * User Story: US-ACA-003 (Update Staff)
 * User Journey: UJ-ACA-004 (Academy Admin)
 * API: PUT /academy/staff/:id (API_ROUTES.ACADEMY.STAFF.UPDATE)
 */
export default function EditStaff() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: staff, loading } = useGet<AcademyStaff>(
    API_ROUTES.ACADEMY.STAFF.VIEW(id)
  );

  const { put, isPending: isSubmitting } = usePut(
    API_ROUTES.ACADEMY.STAFF.UPDATE(id)
  );

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    initials: '',
    imageUrl: '',
    category: '',
    qualifications: [''],
    yearsOfExperience: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'coaching', label: 'Coaching' },
    { value: 'medical', label: 'Medical' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'technical', label: 'Technical' },
    { value: 'scouting', label: 'Scouting' },
    { value: 'support', label: 'Support' },
  ];

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || '',
        role: staff.role || '',
        bio: staff.bio || '',
        initials: staff.initials || '',
        imageUrl: staff.imageUrl || '',
        category: staff.category || '',
        qualifications: staff.qualifications && staff.qualifications.length > 0
          ? staff.qualifications
          : [''],
        yearsOfExperience: staff.yearsOfExperience?.toString() || '',
      });
    }
  }, [staff]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.category) newErrors.category = 'Category is required';

    const validQualifications = formData.qualifications.filter(q => q.trim() !== '');
    if (validQualifications.length === 0) {
      newErrors.qualifications = 'At least one qualification is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Please select a valid image file',
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Image must be smaller than 5MB',
        }));
        return;
      }

      setUploadProgress(10);
      const url = await uploadFile(file, 'image');
      setUploadProgress(100);

      setImageFile(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      setErrors(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleQualificationChange = (index: number, value: string) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index] = value;
    setFormData(prev => ({ ...prev, qualifications: updatedQualifications }));

    if (errors.qualifications && value.trim() !== '') {
      setErrors(prev => ({ ...prev, qualifications: '' }));
    }
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, '']
    }));
  };

  const removeQualification = (index: number) => {
    const updatedQualifications = formData.qualifications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, qualifications: updatedQualifications }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await put({
        ...formData,
        qualifications: formData.qualifications.filter(q => q.trim() !== ''),
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null,
        initials: formData.initials || null,
      });

      router.push('/sports-admin/staff');
    } catch (error) {
      console.error('Error updating staff:', error);
      setErrors({ submit: 'Failed to update staff member. Please try again.' });
    } finally {
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-700 bg-indigo-50">
        Loading staff data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8 border-b border-indigo-100 pb-6">
          <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-3">
            <Briefcase className="w-6 h-6" />
            Edit Staff Member
          </h2>
          <p className="text-indigo-600 mt-2">
            {formData.name || 'Update staff information'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.name ? 'border-red-500' : 'border-indigo-300'}`}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Role/Title *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.role ? 'border-red-500' : 'border-indigo-300'}`}
                />
                {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Initials
                </label>
                <input
                  type="text"
                  name="initials"
                  value={formData.initials}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-indigo-300 p-2"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.category ? 'border-red-500' : 'border-indigo-300'}`}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-indigo-300 p-2"
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Biography</h3>
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Biography
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-md border border-indigo-300 p-2"
              />
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Qualifications & Certifications
              </h3>
              <button
                type="button"
                onClick={addQualification}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add another
              </button>
            </div>

            <div className="space-y-3">
              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => handleQualificationChange(index, e.target.value)}
                    className={`flex-1 rounded-md border p-2 ${errors.qualifications && index === 0 ? 'border-red-500' : 'border-indigo-300'}`}
                  />
                  {formData.qualifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQualification(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.qualifications && (
              <p className="text-sm text-red-600 mt-2">{errors.qualifications}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Profile Image</h3>
            <div>
              <div
                onClick={() => imageInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${imageFile || formData.imageUrl
                  ? 'border-green-300 bg-green-50'
                  : 'border-indigo-300 bg-indigo-50 hover:border-indigo-400'
                  }`}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imageFile || formData.imageUrl ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto w-48 h-48">
                      <Image
                        src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
                        alt="Profile preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                          if (imageInputRef.current) imageInputRef.current.value = '';
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {imageFile ? imageFile.name : 'Current profile image'}
                    </p>
                    {formData.imageUrl && !imageFile && (
                      <p className="text-xs text-gray-500">
                        Click to upload a new image
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="w-16 h-16 text-indigo-400 mx-auto" />
                    <div>
                      <p className="text-indigo-600 font-medium text-lg">
                        Upload profile image
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Recommended: Square image, at least 400×400 pixels
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </div>
                  </div>
                )}
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-indigo-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Errors */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-indigo-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Upload className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Updating...' : 'Update Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}