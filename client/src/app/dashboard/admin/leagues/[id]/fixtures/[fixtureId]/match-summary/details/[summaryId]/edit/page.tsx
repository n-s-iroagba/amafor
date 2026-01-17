// app/match-summaries/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { API_ROUTES } from '@/config/routes';
import api from '@/shared/lib/axios';

interface MatchSummary {
  id: number;
  fixtureId: number;
  summary: string;
}

interface Fixture {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
}

export default function EditMatchSummary() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [fixtureId, setFixtureId] = useState('');
  const [summary, setSummary] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([ fetchMatchSummary()]);
    }
  }, [id]);



  const fetchMatchSummary = async () => {
    try {
      const response = await api.get<MatchSummary>(API_ROUTES.MATCH_SUMMARY.VIEW(id));
      console.log(response.data)
      if (response) {
        const data = response.data;
        setFixtureId(data.fixtureId.toString());
        setSummary(data.summary);
      } else {
        console.error('Failed to fetch match summary');
      }
    } catch (error) {
      console.error('Error fetching match summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fixtureId) newErrors.fixtureId = 'Fixture is required';
    if (!summary.trim()) newErrors.summary = 'Summary is required';
    else if (summary.trim().length < 10)
      newErrors.summary = 'Summary must be at least 10 characters long';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await api.put(
        API_ROUTES.MATCH_SUMMARY.MUTATE(id as string),
        {
          fixtureId: parseInt(fixtureId),
          summary: summary.trim(),
        }
      );

      router.push(`/sports-admin/match-summary/details/${id}`);

      console.error('Failed to update match summary');
    } catch (error) {
      console.error('Error updating match summary:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-sky-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 border-b border-sky-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Edit Match Summary
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Update the match summary
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      

          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-sky-700"
            >
              Summary *
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={8}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                errors.summary ? 'border-red-500' : 'border-sky-300'
              } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              placeholder="Enter match summary..."
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
            )}
            <p className="mt-1 text-xs text-sky-500">
              {summary.length} characters (minimum 10 required)
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
              {isSubmitting ? 'Updating...' : 'Update Summary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
