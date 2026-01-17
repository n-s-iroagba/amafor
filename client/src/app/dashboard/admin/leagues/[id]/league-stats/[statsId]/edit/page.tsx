// app/league-stats/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import api from '@/shared/lib/axios';

interface ClubLeagueStats {
  id: number;
  leagueId: number;
  position: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  wins: number;
  draws: number;
  losses: number;
}

interface League {
  id: number;
  name: string;
  season: string;
}

export default function EditLeagueStats() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [leagues, setLeagues] = useState<League[]>([]);
  const [leagueId, setLeagueId] = useState('');
  const [position, setPosition] = useState('');
  const [points, setPoints] = useState('');
  const [goalsFor, setGoalsFor] = useState('');
  const [goalsAgainst, setGoalsAgainst] = useState('');
  const [wins, setWins] = useState('');
  const [draws, setDraws] = useState('');
  const [losses, setLosses] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([fetchLeagues(), fetchLeagueStats()]);
    }
  }, [id]);

  const fetchLeagues = async () => {
    try {
      const response = await api.get(API_ROUTES.LEAGUES.LIST);

      const data = await response.data;
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchLeagueStats = async () => {
    try {
      const response = await api.get(API_ROUTES.LEAGUE_STATS.LIST);

      const data: ClubLeagueStats = await response.data;
      setLeagueId(data.leagueId.toString());
      setPosition(data.position.toString());
      setPoints(data.points.toString());
      setGoalsFor(data.goalsFor.toString());
      setGoalsAgainst(data.goalsAgainst.toString());
      setWins(data.wins.toString());
      setDraws(data.draws.toString());
      setLosses(data.losses.toString());
    } catch (error) {
      console.error('Error fetching league stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!leagueId) newErrors.leagueId = 'League is required';
    if (!position.trim()) newErrors.position = 'Position is required';
    if (!points.trim()) newErrors.points = 'Points are required';
    if (!goalsFor.trim()) newErrors.goalsFor = 'Goals for is required';
    if (!goalsAgainst.trim())
      newErrors.goalsAgainst = 'Goals against is required';
    if (!wins.trim()) newErrors.wins = 'Wins are required';
    if (!draws.trim()) newErrors.draws = 'Draws are required';
    if (!losses.trim()) newErrors.losses = 'Losses are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/league-stats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leagueId: parseInt(leagueId),
          position: parseInt(position),
          points: parseInt(points),
          goalsFor: parseInt(goalsFor),
          goalsAgainst: parseInt(goalsAgainst),
          wins: parseInt(wins),
          draws: parseInt(draws),
          losses: parseInt(losses),
        }),
      });

      if (response.ok) {
        router.push('/league-stats');
      } else {
        console.error('Failed to update league stats');
      }
    } catch (error) {
      console.error('Error updating league stats:', error);
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
            Edit League Statistics
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Update league statistics for the club
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="leagueId"
              className="block text-sm font-medium text-sky-700"
            >
              League *
            </label>
            <select
              id="leagueId"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                errors.leagueId ? 'border-red-500' : 'border-sky-300'
              } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
            >
              <option value="">Select a league</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name} - {league.season}
                </option>
              ))}
            </select>
            {errors.leagueId && (
              <p className="mt-1 text-sm text-red-600">{errors.leagueId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-sky-700"
              >
                Position *
              </label>
              <input
                type="number"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                min="1"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.position ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="League position"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-sky-700"
              >
                Points *
              </label>
              <input
                type="number"
                id="points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="0"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.points ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Total points"
              />
              {errors.points && (
                <p className="mt-1 text-sm text-red-600">{errors.points}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="goalsFor"
                className="block text-sm font-medium text-sky-700"
              >
                Goals For *
              </label>
              <input
                type="number"
                id="goalsFor"
                value={goalsFor}
                onChange={(e) => setGoalsFor(e.target.value)}
                min="0"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.goalsFor ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Goals scored"
              />
              {errors.goalsFor && (
                <p className="mt-1 text-sm text-red-600">{errors.goalsFor}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="goalsAgainst"
                className="block text-sm font-medium text-sky-700"
              >
                Goals Against *
              </label>
              <input
                type="number"
                id="goalsAgainst"
                value={goalsAgainst}
                onChange={(e) => setGoalsAgainst(e.target.value)}
                min="0"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.goalsAgainst ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Goals conceded"
              />
              {errors.goalsAgainst && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.goalsAgainst}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="wins"
                className="block text-sm font-medium text-sky-700"
              >
                Wins *
              </label>
              <input
                type="number"
                id="wins"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                min="0"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.wins ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Wins"
              />
              {errors.wins && (
                <p className="mt-1 text-sm text-red-600">{errors.wins}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="draws"
                className="block text-sm font-medium text-sky-700"
              >
                Draws *
              </label>
              <input
                type="number"
                id="draws"
                value={draws}
                onChange={(e) => setDraws(e.target.value)}
                min="0"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.draws ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Draws"
              />
              {errors.draws && (
                <p className="mt-1 text-sm text-red-600">{errors.draws}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="losses"
                className="block text-sm font-medium text-sky-700"
              >
                Losses *
              </label>
              <input
                type="number"
                id="losses"
                value={losses}
                onChange={(e) => setLosses(e.target.value)}
                min="0"
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${
                  errors.losses ? 'border-red-500' : 'border-sky-300'
                } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Losses"
              />
              {errors.losses && (
                <p className="mt-1 text-sm text-red-600">{errors.losses}</p>
              )}
            </div>
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
              {isSubmitting ? 'Updating...' : 'Update Statistics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
