// app/goals/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { Player } from '@/features/player/types';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';


interface Fixture {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
}

enum GoalSide {
  AMAFOR = 'amafor',
  OTHER = 'other',
}

interface GoalFormState {
  scorer: string;
  minute: string;
  isPenalty: boolean;
  goalSide: GoalSide;
  selectedPlayerId: string;
  otherScorer: string;
}

export default function NewGoal() {
  const router = useRouter();
  const params = useParams();
  const fixtureId = params.fixtureId;

  const [formState, setFormState] = useState<GoalFormState>({
    scorer: '',
    minute: '',
    isPenalty: false,
    goalSide: GoalSide.AMAFOR,
    selectedPlayerId: '',
    otherScorer: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { post, isPending: isSubmitting } = usePost(
    API_ROUTES.GOALS.CREATE(fixtureId as string)
  );

  const {
    data: amaforPlayers,
    loading,
    error,
  } = useGet<Player[]>(API_ROUTES.PLAYERS.LIST);

  // Update scorer based on goal side selection
  useEffect(() => {
    if (formState.goalSide === GoalSide.AMAFOR && formState.selectedPlayerId) {
      const selectedPlayer = amaforPlayers?.find(
        (player) => player.id.toString() === formState.selectedPlayerId
      );
      setFormState((prev) => ({
        ...prev,
        scorer: selectedPlayer ? `${selectedPlayer.name} ` : '',
      }));
    } else if (formState.goalSide === GoalSide.OTHER) {
      setFormState((prev) => ({
        ...prev,
        scorer: prev.otherScorer,
      }));
    }
  }, [
    formState.goalSide,
    formState.selectedPlayerId,
    formState.otherScorer,
    amaforPlayers,
  ]);

  const updateFormState = (updates: Partial<GoalFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fixtureId) newErrors.fixtureId = 'Fixture is required';

    if (formState.goalSide === GoalSide.AMAFOR) {
      if (!formState.selectedPlayerId)
        newErrors.scorer = 'Please select a player';
    } else {
      if (!formState.otherScorer.trim())
        newErrors.scorer = 'Scorer name is required';
    }

    if (!formState.minute.trim()) {
      newErrors.minute = 'Minute is required';
    } else if (
      parseInt(formState.minute) < 1 ||
      parseInt(formState.minute) > 120
    ) {
      newErrors.minute = 'Minute must be between 1 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response: any = await post({
        fixtureId: fixtureId,
        scorer: formState.scorer,
        minute: parseInt(formState.minute),
        isPenalty: formState.isPenalty,
        goalSide: formState.goalSide,
        playerId:
          formState.goalSide === GoalSide.AMAFOR
            ? formState.selectedPlayerId
            : null,
      });

      const leagueId = params.id as string;
      const fId = params.fixtureId as string;
      router.push(`/dashboard/admin/leagues/${leagueId}/fixtures/${fId}/goals`);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  if (loading) {
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
            Add New Goal
          </h2>
          <p className="text-sky-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Record a new goal for a fixture
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Goal Side Selection */}
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Goal Side *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="goalSide"
                  value={GoalSide.AMAFOR}
                  checked={formState.goalSide === GoalSide.AMAFOR}
                  onChange={(e) =>
                    updateFormState({
                      goalSide: e.target.value as GoalSide,
                      selectedPlayerId: '',
                      otherScorer: '',
                    })
                  }
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300"
                />
                <span className="ml-2 text-sm text-sky-700">Amafor</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="goalSide"
                  value={GoalSide.OTHER}
                  checked={formState.goalSide === GoalSide.OTHER}
                  onChange={(e) =>
                    updateFormState({
                      goalSide: e.target.value as GoalSide,
                      selectedPlayerId: '',
                      otherScorer: '',
                    })
                  }
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300"
                />
                <span className="ml-2 text-sm text-sky-700">Other Team</span>
              </label>
            </div>
          </div>

          {/* Scorer Selection - Conditional based on goal side */}
          <div>
            <label
              htmlFor="scorer"
              className="block text-sm font-medium text-sky-700"
            >
              Scorer *
            </label>

            {formState.goalSide === GoalSide.AMAFOR ? (
              <select
                id="scorer"
                value={formState.selectedPlayerId}
                onChange={(e) =>
                  updateFormState({ selectedPlayerId: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.scorer ? 'border-red-500' : 'border-sky-300'
                  } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
              >
                <option value="">Select a player...</option>
                {amaforPlayers?.map((player) => (
                  <option key={player.id} value={player.id.toString()}>
                    {player.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id="scorer"
                value={formState.otherScorer}
                onChange={(e) =>
                  updateFormState({ otherScorer: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.scorer ? 'border-red-500' : 'border-sky-300'
                  } shadow-sm focus:border-sky-500 focus:ring-sky-500`}
                placeholder="Enter scorer name"
              />
            )}

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
              value={formState.minute}
              onChange={(e) => updateFormState({ minute: e.target.value })}
              min="1"
              max="120"
              className={`mt-1 block w-full rounded-md border p-2 text-sm sm:text-base ${errors.minute ? 'border-red-500' : 'border-sky-300'
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
              checked={formState.isPenalty}
              onChange={(e) => updateFormState({ isPenalty: e.target.checked })}
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
              {isSubmitting ? 'Adding...' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
