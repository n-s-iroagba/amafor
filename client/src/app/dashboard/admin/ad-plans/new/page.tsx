'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/shared/lib/axios';
import { API_ROUTES } from '@/config/routes';

export default function NewAdPlan() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxImpressions, setMaxImpressions] = useState('');
  const [zone, setZone] = useState('top_banner');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    else if (parseFloat(price) <= 0)
      newErrors.price = 'Price must be greater than 0';
    if (maxImpressions && parseInt(maxImpressions) <= 0)
      newErrors.maxImpressions = 'Max impressions must be greater than 0';
    if (!zone) newErrors.zone = 'Zone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await api.post(API_ROUTES.ADS.PLANS.CREATE, {
        name,
        description: description || null,
        maxImpressions: maxImpressions ? parseInt(maxImpressions) : null,
        zone,
        price: parseFloat(price),
      });

      router.push('/admin/ad-plans');
    } catch (error) {
      alert('An Error Occurred');
      console.error('Error creating ad plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 border-b border-sky-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Create New Ad Plan
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Add a new advertising plan
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-sky-700"
            >
              Plan Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                errors.name ? 'border-red-500' : 'border-sky-300'
              } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              placeholder="Enter plan name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-sky-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-sky-300 p-2 text-sm sm:text-base shadow-sm focus:border-sky-500 focus:ring-sky-500"
              placeholder="Enter plan description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-sky-700"
              >
                Price (Naira) *
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.price ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="maxImpressions"
                className="block text-sm font-medium text-sky-700"
              >
                Max Impressions
              </label>
              <input
                type="number"
                id="maxImpressions"
                value={maxImpressions}
                onChange={(e) => setMaxImpressions(e.target.value)}
                min="1"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.maxImpressions ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Enter maximum impressions"
              />
              {errors.maxImpressions && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maxImpressions}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="zone"
              className="block text-sm font-medium text-sky-700"
            >
              Ad Zone *
            </label>
            <select
              id="zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                errors.zone ? 'border-red-500' : 'border-sky-300'
              } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
            >
              <option value="top_banner">Top Banner</option>
              <option value="footer_banner">Footer Banner</option>
            </select>
            {errors.zone && (
              <p className="mt-1 text-sm text-red-600">{errors.zone}</p>
            )}
            <p className="mt-1 text-xs text-sky-600">
              {zone === 'top_banner' 
                ? 'Top banner appears at the top of the page' 
                : 'Footer banner appears at the bottom of the page'
              }
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-sky-300 rounded-md shadow-sm text-sm font-medium text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mt-2 sm:mt-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-sky-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-75"
            >
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}