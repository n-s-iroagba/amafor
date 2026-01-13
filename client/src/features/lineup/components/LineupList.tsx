import React from 'react';
import { Shirt, Users, ShirtIcon, Edit, Trash2 } from 'lucide-react';
import { Fixture, Lineup } from '@/types';
import LineupForm from './LineupForm';

interface LineupListProps {
  fixture: Fixture;
  lineup:Lineup[]
  onEdit: (player: Lineup) => void;
  onDelete: (playerId: Lineup) => void;

  showActions?: boolean;
}

const LineupList: React.FC<LineupListProps> = ({
  fixture,
  onEdit,
  onDelete,
  lineup,

  showActions = true,
}) => {




  // Separate starters and substitutes
  const starters = lineup ? lineup.filter((player) => player.isStarter) : [];
  const substitutes = lineup
    ? lineup.filter((player) => !player.isStarter)
    : [];

  // Group players by position
  const groupByPosition = (players: Lineup[]) => {
    return players.reduce((groups: Record<string, Lineup[]>, player) => {
      const position = player.position;
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(player);
      return groups;
    }, {});
  };

  const startersByPosition = groupByPosition(starters);
  const substitutesByPosition = groupByPosition(substitutes);

  const PositionGroup = ({
    title,
    players,
    icon: Icon,
  }: {
    title: string;
    players: Lineup[];
    icon: React.ComponentType<any>;
  }) => (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {players.length}
        </span>
      </div>

      {Object.entries(groupByPosition(players)).map(
        ([position, positionPlayers]) => (
          <div key={position} className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
              {position}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {positionPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Shirt className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {player.player.name}
                    </span>
                  </div>

                  {showActions && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onEdit(player)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                        aria-label="Edit player"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(player)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Delete player"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          Team Lineup
        </h2>

        <div className="flex space-x-2 text-sm">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {starters.length} Starters
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {substitutes.length} Substitutes
          </span>
        </div>
      </div>

      {lineup?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>No players in the lineup yet.</p>
          <p className="text-sm">Add players to create your team lineup.</p>
          <LineupForm fixtureId={fixture.id} activeForm={'bulk'} />
        </div>
      ) : (
        <>
          {starters.length > 0 && (
            <PositionGroup
              title="Starting XI"
              players={starters}
              icon={Shirt}
            />
          )}

          {substitutes.length > 0 && (
            <PositionGroup
              title="Substitutes"
              players={substitutes}
              icon={ShirtIcon}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LineupList;
