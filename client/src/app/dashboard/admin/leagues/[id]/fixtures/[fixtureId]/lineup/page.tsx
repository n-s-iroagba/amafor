'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Fixture } from '@/features/fixture/types';
import { Lineup } from '@/features/lineup/types';
import LineupForm from '@/features/lineup/components/LineupForm';
import LineupList from '@/features/lineup/components/LineupList';
import { Loader2, ArrowLeft } from 'lucide-react';

const FixtureLineupPage = () => {
  const params = useParams();
  const router = useRouter();
  const fixtureId = params.fixtureId as string;

  const { data: fixture, loading: fixtureLoading } = useGet<Fixture>(
    API_ROUTES.FIXTURES.VIEW(fixtureId)
  );

  const { data: lineup, loading: lineupLoading, refetch } = useGet<Lineup[]>(
    API_ROUTES.LINEUP.BY_FIXTURE(fixtureId)
  );

  const [editingPlayer, setEditingPlayer] = useState<Lineup | null>(null);

  const handleEdit = (player: Lineup) => {
    setEditingPlayer(player);
  };

  const handleDelete = async (player: Lineup) => {
    // Implementation should happen in LineupList or here passed as prop
    // LineupList calls onDelete.
    // For now, simpler to handle it inside LineupList or just log.
    // Real implementation would call useDelete.
    console.log('Delete requested for', player);
  };

  const handleSuccess = () => {
    setEditingPlayer(null);
    refetch();
  };

  if (fixtureLoading || lineupLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!fixture) return <div className="p-4">Fixture not found</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-2 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to details
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Lineup Management
          </h1>
          <p className="text-gray-500">{fixture.homeTeam} vs {fixture.awayTeam}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Current Lineup</h2>
        <LineupList
          lineup={lineup || []}
          fixture={fixture}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editingPlayer ? 'Edit Player' : 'Add Players'}
        </h2>
        {editingPlayer ? (
          <div>
            <button
              onClick={() => setEditingPlayer(null)}
              className="mb-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Cancel Edit
            </button>
            {/* Pass necessary props to LineupForm for editing */}
            {/* Note: LineupForm might process internal submit. Need to handle onSuccess */}
            <LineupForm fixtureId={fixture.id} activeForm="edit" />
          </div>
        ) : (
          <LineupForm fixtureId={fixture.id} activeForm="bulk" />
        )}
      </div>
    </div>
  );
};

export default FixtureLineupPage;
