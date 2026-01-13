'use client';
import React, { useState } from 'react';
import LineupList from '@/components/LineupList';
import LineupForm from '@/components/LineupForm';
import { Lineup, Fixture } from '@/types';
import { useGet } from '@/hooks/useApiQuery';

import { useParams } from 'next/navigation';
import { Spinner } from '@/components/Spinner';
import { API_ROUTES } from '@/config/routes';

const FixtureLineup = () => {
  const params = useParams();
  const fixtureId = params.fixtureId;
  const { data: fixture, loading: fixtureLoadiing } = useGet<Fixture>(
    API_ROUTES.FIXTURES.VIEW(fixtureId as string)
  );
  const { data: lineup, loading } = useGet<Lineup[]>(
    API_ROUTES.LINEUP.BY_FIXTURE(fixtureId as string)
  );

  const [editingPlayer, setEditingPlayer] = useState<Lineup | null>(null);
  const [playerToBeDeleted, setPlayerToBeDeleted] = useState<Lineup | null>(
    null
  );

  const handleEdit = (player: Lineup) => {
    setEditingPlayer(player);
  };

  const handleDelete = (player: Lineup) => {
    setPlayerToBeDeleted(player);
  };

  const handleSuccess = () => {
    setPlayerToBeDeleted(null);

    setEditingPlayer(null);
    window.location.reload();
  };

  const handleCancel = () => {
    setEditingPlayer(null);

    setPlayerToBeDeleted(null);
  };

  if (!loading) return <Spinner />;
  if (lineup && fixture)
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Lineup for {fixture.homeTeam} vs {fixture.awayTeam}
          </h1>

          <LineupList
            lineup={lineup}
            fixture={fixture}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {editingPlayer && (
          <LineupForm fixtureId={fixture.id} activeForm="edit" />
        )}
      </div>
    );
  if (!lineup && fixture)
    return <LineupForm fixtureId={fixture?.id} activeForm="bulk" />;
};

export default FixtureLineup;
