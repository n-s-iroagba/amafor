'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import api from '@/lib/apiUtils';

interface AdPlan {
  id: number;
  name: string;
  description: string | null;
  maxImpressions: number | null;
  zone: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export default function EditAdPlan() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const planId = params.id as string;

  const {
    data: plan,
    loading,
    error,
  } = useGet<AdPlan>(API_ROUTES.ADS.PLANS.DETAIL(planId));

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxImpressions: '',
    zone: 'top_banner',
    price: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with plan data when it loads
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || '',
        maxImpressions: plan.maxImpressions?.toString() || '',
        zone: plan.zone,
        price: plan.price.toString(),
      });
    }
  }, [plan]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (parseFloat(formData.price) <= 0)
      newErrors.price = 'Price must be greater than 0';
    if (formData.maxImpressions && parseInt(formData.maxImpressions) <= 0)
      newErrors.maxImpressions = 'Max impressions must be greater than 0';
    if (!formData.zone) newErrors.zone = 'Zone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submissionData = {
      name: formData.name,
      description: formData.description || null,
      maxImpressions: formData.maxImpressions
        ? parseInt(formData.maxImpressions)
        : null,
      zone: formData.zone,
      price: parseFloat(formData.price),
    };

    setIsSubmitting(true);
    try {
      await api.put(API_ROUTES.ADS.PLANS.UPDATE(planId), submissionData);
      router.push('/admin/ad-plans');
    } catch (error) {
      console.error('Error updating ad plan:', error);
      alert('Error occurred');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-sky-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-sky-200 rounded mb-6"></div>
            <div className="h-64 bg-sky-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-sky-900 mb-2">
              Ad Plan Not Found
            </h2>
            <p className="text-sky-700 mb-6">
              The ad plan you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push('/admin/ad-plans')}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Back to Ad Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-sky-900">Edit Ad Plan</h1>
          <p className="text-sky-700 mt-1">Update advertising plan details</p>
        </div>

        <div className="bg-white rounded-lg border border-sky-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-sky-700 mb-2"
              >
                Plan Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-sky-300'
                }`}
                placeholder="Enter plan name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-sky-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter plan description"
              />
            </div>

            {/* Price and Impressions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-sky-700 mb-2"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-sky-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="maxImpressions"
                  className="block text-sm font-medium text-sky-700 mb-2"
                >
                  Max Impressions
                </label>
                <input
                  type="number"
                  id="maxImpressions"
                  value={formData.maxImpressions}
                  onChange={(e) =>
                    handleChange('maxImpressions', e.target.value)
                  }
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                    errors.maxImpressions ? 'border-red-500' : 'border-sky-300'
                  }`}
                  placeholder="Enter maximum impressions"
                />
                {errors.maxImpressions && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maxImpressions}
                  </p>
                )}
                <p className="mt-1 text-xs text-sky-600">
                  Leave empty for unlimited impressions
                </p>
              </div>
            </div>

            {/* Zone Selection */}
            <div>
              <label
                htmlFor="zone"
                className="block text-sm font-medium text-sky-700 mb-2"
              >
                Ad Zone *
              </label>
              <select
                id="zone"
                value={formData.zone}
                onChange={(e) => handleChange('zone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                  errors.zone ? 'border-red-500' : 'border-sky-300'
                }`}
              >
                <option value="top_banner">Top Banner</option>
                <option value="footer_banner">Footer Banner</option>
              </select>
              {errors.zone && (
                <p className="mt-1 text-sm text-red-600">{errors.zone}</p>
              )}
              <p className="mt-1 text-xs text-sky-600">
                {formData.zone === 'top_banner' 
                  ? 'Top banner appears at the top of the page' 
                  : 'Footer banner appears at the bottom of the page'
                }
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-sky-200">
              <button
                type="button"
                onClick={() => router.push('/admin/ad-plans')}
                className="px-4 py-2 border border-sky-300 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-sky-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}