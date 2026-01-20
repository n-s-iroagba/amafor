// app/leagues/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

export default function NewLeague() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [isFriendly, setIsFriendly] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { post, isPending: isSubmitting } = usePost(API_ROUTES.LEAGUES.CREATE);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!season.trim()) newErrors.season = 'Season is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await post({
        name,
        season,
        isFriendly,
      });

      router.push('/sports-admin/leagues');
    } catch (error) {
      console.error('Error creating league:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 border-b border-sky-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Create New League
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Add a new league to manage fixtures and statistics
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-sky-700"
            >
              League Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              placeholder="Enter league name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="season"
              className="block text-sm font-medium text-sky-700"
            >
              Season *
            </label>
            <input
              type="text"
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.season ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              placeholder="e.g., 2023/2024"
            />
            {errors.season && (
              <p className="mt-1 text-sm text-red-600">{errors.season}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="isFriendly"
              type="checkbox"
              checked={isFriendly}
              onChange={(e) => setIsFriendly(e.target.checked)}
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300 rounded"
            />
            <label
              htmlFor="isFriendly"
              className="ml-2 block text-sm text-sky-700"
            >
              Friendly League
            </label>
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
              {isSubmitting ? 'Creating...' : 'Create League'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
