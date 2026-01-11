'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axiosClient';

interface Goal {
  id: number;
  fixtureId: number;
  scorer: string;
  minute: number;
  isPenalty: boolean;
}

interface Fixture {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
}

export default function EditGoal() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fixtureId, setFixtureId] = useState('');
  const [scorer, setScorer] = useState('');
  const [minute, setMinute] = useState('');
  const [isPenalty, setIsPenalty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([fetchFixtures(), fetchGoal()]);
    }
  }, [id]);

  const fetchFixtures = async () => {
    try {
      const { data } = await api.get<Fixture[]>('/fixtures');
      setFixtures(data);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    }
  };

  const fetchGoal = async () => {
    try {
      const { data } = await api.get<Goal>(`/goals/${id}`);
      setFixtureId(data.fixtureId.toString());
      setScorer(data.scorer);
      setMinute(data.minute.toString());
      setIsPenalty(data.isPenalty);
    } catch (error) {
      console.error('Error fetching goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fixtureId) newErrors.fixtureId = 'Fixture is required';
    if (!scorer.trim()) newErrors.scorer = 'Scorer is required';
    if (!minute.trim()) newErrors.minute = 'Minute is required';
    else if (parseInt(minute) < 1 || parseInt(minute) > 120)
      newErrors.minute = 'Minute must be between 1 and 120';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await api.put(`/goals/${id}`, {
        fixtureId: parseInt(fixtureId),
        scorer,
        minute: parseInt(minute),
        isPenalty,
      });

      router.push('/goals'); // ✅ redirect after success
    } catch (error) {
      console.error('Error updating goal:', error);
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
            Edit Goal
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Update goal details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="fixtureId"
              className="block text-sm font-medium text-sky-700"
            >
              Fixture *
            </label>
            <select
              id="fixtureId"
              value={fixtureId}
              onChange={(e) => setFixtureId(e.target.value)}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                errors.fixtureId ? 'border-red-500' : 'border-sky-300'
              } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
            >
              <option value="">Select a fixture</option>
              {fixtures.map((fixture) => (
                <option key={fixture.id} value={fixture.id}>
                  {fixture.homeTeam} vs {fixture.awayTeam} -{' '}
                  {new Date(fixture.date).toLocaleDateString()}
                </option>
              ))}
            </select>
            {errors.fixtureId && (
              <p className="mt-1 text-sm text-red-600">{errors.fixtureId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="scorer"
              className="block text-sm font-medium text-sky-700"
            >
              Scorer *
            </label>
            <input
              type="text"
              id="scorer"
              value={scorer}
              onChange={(e) => setScorer(e.target.value)}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                errors.scorer ? 'border-red-500' : 'border-sky-300'
              } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              placeholder="Enter scorer name"
            />
            {errors.scorer && (
              <p className="mt-1 text-sm text-red-600">{errors.scorer}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="minute"
              className="block text-sm font-medium text-sky-700"
            >
              Minute *
            </label>
            <input
              type="number"
              id="minute"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              min="1"
              max="120"
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                errors.minute ? 'border-red-500' : 'border-sky-300'
              } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              placeholder="Enter minute of goal"
            />
            {errors.minute && (
              <p className="mt-1 text-sm text-red-600">{errors.minute}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="isPenalty"
              type="checkbox"
              checked={isPenalty}
              onChange={(e) => setIsPenalty(e.target.checked)}
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300 rounded"
            />
            <label
              htmlFor="isPenalty"
              className="ml-2 block text-sm text-sky-700"
            >
              Penalty Goal
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
              {isSubmitting ? 'Updating...' : 'Update Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
