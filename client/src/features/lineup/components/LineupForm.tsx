import React, { useState, useEffect } from 'react';
import { Plus, Minus, Users, Edit, Save } from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import api from '@/shared/lib/axios';
import { Fixture } from '@/types';

// TypeScript interfaces
interface Player {
  id: number;
  name: string;
  position: string;
  jerseyNumber: number;
  imageUrl?: string;
  bio?: string;
  dateOfBirth?: Date;
  nationality?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Lineup {
  id: number;
  fixtureId: number;
  player: Player;
  position: string;
  isStarter: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LineupFormData {
  playerId: number | null;
  position: string;
  isStarter: boolean;
}

interface LineupFormsProps {
  activeForm: 'bulk' | 'edit';
  fixtureId: number;
  player?: Lineup;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LineupForms = ({
  activeForm,
  fixtureId,
  player,
  onSuccess,
  onCancel,
}: LineupFormsProps) => {
  // State for bulk create form
  const [bulkLineups, setBulkLineups] = useState<LineupFormData[]>([
    { playerId: null, position: '', isStarter: true },
  ]);

  // State for edit form
  const [editLineups, setEditLineups] = useState<Lineup[]>([]);

  // API data
  const { data: players, loading: playersLoading } = useGet<Player[]>(API_ROUTES.PLAYERS.LIST);
  const{data:fixture,loading,error}= useGet<Fixture>(API_ROUTES.FIXTURES.VIEW(fixtureId))
  const { data: preexistingLineup, refetch: refetchLineup } = useGet<Lineup[]>(
    API_ROUTES.LINEUP.BY_FIXTURE(fixtureId)
  );

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const positions = [
    'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST',
  ];

  // Initialize edit form with existing lineups
  useEffect(() => {
    if (activeForm === 'edit' && preexistingLineup) {
      setEditLineups(preexistingLineup);
    }
  }, [activeForm, preexistingLineup]);

  // Initialize single edit form
  useEffect(() => {
    if (activeForm === 'edit' && player) {
      setEditLineups([player]);
    }
  }, [activeForm, player]);
  if (playersLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
    if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

    if (!fixture) {
    return (
      <div className="flex justify-center items-center py-12">
        No fixture
      </div>
    );
  }
  // Helper function to get available players for bulk create
  const getAvailablePlayersForBulk = (currentIndex: number) => {
    if (!players) return [];
    
    const selectedPlayerIds = bulkLineups
      .map((lineup, index) => (index !== currentIndex ? lineup.playerId : null))
      .filter((id) => id !== null) as number[];
    
    return players.filter(
      (player) => !selectedPlayerIds.includes(player.id)
    );
  };

  // Helper function to get available players for edit
  const getAvailablePlayersForEdit = (currentIndex: number) => {
    if (!players) return [];
    
    const selectedPlayerIds = editLineups
      .map((lineup, index) => (index !== currentIndex ? lineup.player.id : null))
      .filter((id) => id !== null) as number[];
    
    return players.filter(
      (player) => !selectedPlayerIds.includes(player.id)
    );
  };

  // Bulk create form handlers
  const addBulkLineup = () => {
    setBulkLineups([
      ...bulkLineups,
      { playerId: null, position: '', isStarter: true },
    ]);
  };

  const removeBulkLineup = (index: number) => {
    if (bulkLineups.length > 1) {
      setBulkLineups(bulkLineups.filter((_, i) => i !== index));
    }
  };

  const updateBulkLineup = (index: number, field: keyof LineupFormData, value: any) => {
    const updated = [...bulkLineups];
    updated[index] = { ...updated[index], [field]: value };
    setBulkLineups(updated);
  };

  // Edit form handlers
  const addEditLineup = () => {
    if (!players || players.length === 0) return;

    const newLineup: Lineup = {
      id: Date.now(), // Temporary ID for new lineup
      fixtureId: fixture?.id,
      player: players[0],
      position: '',
      isStarter: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditLineups([...editLineups, newLineup]);
  };

  const removeEditLineup = (index: number) => {
    if (editLineups.length > 1) {
      setEditLineups(editLineups.filter((_, i) => i !== index));
    }
  };

  const updateEditLineup = (index: number, field: string, value: any) => {
    const updated = [...editLineups];
    if (field === 'playerId') {
      const player = players?.find((p) => p.id === value);
      if (player) {
        updated[index] = { ...updated[index], player };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEditLineups(updated);
  };

  // Validation
  const validateBulkForm = () => {
    const newErrors: Record<string, string> = {};
    
    const validLineups = bulkLineups.filter(
      (lineup) => lineup.playerId && lineup.position
    );

    if (validLineups.length === 0) {
      newErrors.general = 'Please add at least one valid lineup with player and position selected.';
    }

    // Check for duplicate players
    const playerIds = bulkLineups.map(lineup => lineup.playerId).filter(id => id !== null);
    const uniquePlayerIds = new Set(playerIds);
    if (playerIds.length !== uniquePlayerIds.size) {
      newErrors.general = 'Duplicate players are not allowed in the lineup.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors: Record<string, string> = {};
    
    const invalidLineups = editLineups.filter(
      (lineup) => !lineup.player?.id || !lineup.position
    );

    if (invalidLineups.length > 0) {
      newErrors.general = 'All lineups must have a player and position selected.';
    }

    // Check for duplicate players
    const playerIds = editLineups.map(lineup => lineup.player?.id).filter(id => id !== undefined);
    const uniquePlayerIds = new Set(playerIds);
    if (playerIds.length !== uniquePlayerIds.size) {
      newErrors.general = 'Duplicate players are not allowed in the lineup.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API Handlers
  const handleBulkSubmit = async () => {
    if (!validateBulkForm()) return;

    setIsSubmitting(true);
    try {
      const validLineups = bulkLineups.filter(
        (lineup) => lineup.playerId && lineup.position
      );

      // Create lineups one by one
      const createPromises = validLineups.map(lineup =>
        api.post(API_ROUTES.LINEUP.CREATE, {
          fixtureId,
          playerId: lineup.playerId,
          position: lineup.position,
          isStarter: lineup.isStarter,
        })
      );

      await Promise.all(createPromises);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setBulkLineups([{ playerId: null, position: '', isStarter: true }]);
      setErrors({});
      
    } catch (error: any) {
      console.error('Error creating lineups:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to create lineups. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateEditForm()) return;

    setIsSubmitting(true);
    try {
      // Update existing lineups and create new ones
      const updatePromises = editLineups.map(lineup => {
        if (lineup.id && lineup.id > 0) {
          // Update existing lineup
          return api.put(API_ROUTES.LINEUP.UPDATE(lineup.id), {
            position: lineup.position,
            isStarter: lineup.isStarter,
          });
        } else {
          // Create new lineup
          return api.post(API_ROUTES.LINEUP.CREATE, {
            fixtureId:fixtureId,
            playerId: lineup.player.id,
            position: lineup.position,
            isStarter: lineup.isStarter,
          });
        }
      });

      await Promise.all(updatePromises);
      
      if (onSuccess) {
        onSuccess();
      }
      
      setErrors({});
      
    } catch (error: any) {
      console.error('Error updating lineups:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update lineups. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeForm === 'bulk' ? 'Add Players to Lineup' : 'Edit Lineup'}
          </h2>
          <p className="text-gray-600 mt-1">
            {activeForm === 'bulk' 
              ? 'Add multiple players to the lineup at once' 
              : 'Manage existing lineup positions and players'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{errors.general}</p>
        </div>
      )}

      {/* Form Content */}
      {activeForm === 'bulk' ? (
        // Bulk Create Form
        <div className="space-y-6">
          <div className="space-y-4">
            {bulkLineups.map((lineup, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Player
                  </label>
                  <select
                    value={lineup.playerId || ''}
                    onChange={(e) =>
                      updateBulkLineup(
                        index,
                        'playerId',
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Player</option>
                    {getAvailablePlayersForBulk(index).map((player) => (
                      <option key={player.id} value={player.id}>
                        #{player.jerseyNumber} {player.name} ({player.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={lineup.position}
                    onChange={(e) =>
                      updateBulkLineup(index, 'position', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lineup.isStarter}
                      onChange={(e) =>
                        updateBulkLineup(
                          index,
                          'isStarter',
                          e.target.checked
                        )
                      }
                      className="mr-2 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Starter
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => removeBulkLineup(index)}
                  disabled={bulkLineups.length === 1}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={addBulkLineup}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Player
            </button>

            <button
              onClick={handleBulkSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Lineups
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Edit Form
        <div className="space-y-6">
          <div className="space-y-4">
            {editLineups.map((lineup, index) => (
              <div
                key={lineup.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Player
                  </label>
                  <select
                    value={lineup.player?.id || ''}
                    onChange={(e) =>
                      updateEditLineup(
                        index,
                        'playerId',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Player</option>
                    {getAvailablePlayersForEdit(index).map((player) => (
                      <option key={player.id} value={player.id}>
                        #{player.jerseyNumber} {player.name} ({player.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={lineup.position}
                    onChange={(e) =>
                      updateEditLineup(index, 'position', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lineup.isStarter}
                      onChange={(e) =>
                        updateEditLineup(
                          index,
                          'isStarter',
                          e.target.checked
                        )
                      }
                      className="mr-2 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Starter
                    </span>
                  </label>
                </div>

                {lineup.id && lineup.id < 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    New
                  </span>
                )}

                <button
                  onClick={() => removeEditLineup(index)}
                  disabled={editLineups.length === 1}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={addEditLineup}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Player
            </button>

            <button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineupForms;