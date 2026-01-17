'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Calendar as CalendarIcon } from 'lucide-react';
import api from '@/shared/lib/axios';
import { uploadFile } from '@/shared/utils';


export default function NewTrialist() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    position: '',
    preferredFoot: 'RIGHT',
    height: '',
    weight: '',
    previousClub: '',
    videoUrl: '',
    cvUrl: '',
    status: 'PENDING',
    notes: '',
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState<string>('');

  const videoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const positions = [
    'Goalkeeper', 'Center Back', 'Right Back', 'Left Back',
    'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder',
    'Right Winger', 'Left Winger', 'Striker', 'Forward'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.position) newErrors.position = 'Position is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (file: File, type: 'video' | 'cv') => {
    setUploading(type);
    setUploadProgress(10);
    
    try {
      const url = await uploadFile(file,'image');
      setUploadProgress(100);
      
      if (type === 'video') {
        setFormData(prev => ({ ...prev, videoUrl: url }));
        setVideoFile(file);
      } else {
        setFormData(prev => ({ ...prev, cvUrl: url }));
        setCvFile(file);
      }
      
      setErrors(prev => ({ ...prev, [type === 'video' ? 'videoUrl' : 'cvUrl']: '' }));
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [type === 'video' ? 'videoUrl' : 'cvUrl']: 'Failed to upload file' 
      }));
    } finally {
      setUploadProgress(0);
      setUploading('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await api.post(
        '/trialists',
        {
          ...formData,
          dob: new Date(formData.dob).toISOString(),
          height: formData.height ? parseInt(formData.height) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response) {
        router.push('/sports-admin/trialist');
      }
    } catch (error) {
      console.error('Error creating trialist:', error);
      setErrors({ submit: 'Failed to create trialist. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8 border-b border-emerald-100 pb-6">
          <h2 className="text-2xl font-bold text-emerald-800">Add New Trialist</h2>
          <p className="text-emerald-600 mt-2">Register a new trialist to the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.firstName ? 'border-red-500' : 'border-emerald-300'}`}
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.lastName ? 'border-red-500' : 'border-emerald-300'}`}
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.email ? 'border-red-500' : 'border-emerald-300'}`}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.phone ? 'border-red-500' : 'border-emerald-300'}`}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.dob ? 'border-red-500' : 'border-emerald-300'}`}
                />
                {errors.dob && <p className="text-sm text-red-600 mt-1">{errors.dob}</p>}
              </div>
            </div>
          </div>

          {/* Football Information */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">Football Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Position *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border p-2 ${errors.position ? 'border-red-500' : 'border-emerald-300'}`}
                >
                  <option value="">Select position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {errors.position && <p className="text-sm text-red-600 mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Preferred Foot
                </label>
                <select
                  name="preferredFoot"
                  value={formData.preferredFoot}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-emerald-300 p-2"
                >
                  <option value="RIGHT">Right</option>
                  <option value="LEFT">Left</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-emerald-300 p-2"
                  min="100"
                  max="250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-emerald-300 p-2"
                  min="30"
                  max="150"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Previous Club
                </label>
                <input
                  type="text"
                  name="previousClub"
                  value={formData.previousClub}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-emerald-300 p-2"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">Attachments</h3>
            
            {/* Video Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Highlight Video
              </label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'video');
                  }}
                  className="hidden"
                />

                {videoFile ? (
                  <div className="space-y-2">
                    <div className="text-emerald-600 font-medium">{videoFile.name}</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                        setFormData(prev => ({ ...prev, videoUrl: '' }));
                        if (videoInputRef.current) videoInputRef.current.value = '';
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-emerald-600 font-medium">Upload video file</div>
                    <div className="text-sm text-gray-500">MP4, MOV, AVI up to 100MB</div>
                  </div>
                )}
              </div>
              {uploading === 'video' && uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Resume/CV
              </label>
              <div
                onClick={() => cvInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'cv');
                  }}
                  className="hidden"
                />

                {cvFile ? (
                  <div className="space-y-2">
                    <div className="text-emerald-600 font-medium">{cvFile.name}</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                        setFormData(prev => ({ ...prev, cvUrl: '' }));
                        if (cvInputRef.current) cvInputRef.current.value = '';
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-emerald-600 font-medium">Upload resume</div>
                    <div className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</div>
                  </div>
                )}
              </div>
              {uploading === 'cv' && uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">Additional Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-md border border-emerald-300 p-2"
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="INVITED">Invited</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Scout Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-emerald-300 p-2"
                placeholder="Add any notes or observations..."
              />
            </div>
          </div>

          {/* Form Errors */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-emerald-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-emerald-300 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Upload className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Trialist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}