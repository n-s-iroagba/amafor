'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Star, X, Plus, Search, Loader2, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';

/**
 * Page: Team Players (Admin)
 * Screen ID: SC-130
 * Description: Manage player assignment within a team — add, transfer, remove, assign captain.
 * BRD Requirements: BR-TM-02, BR-TM-03, BR-TM-04, BR-TM-07
 * User Journey: UJ-ADM-013 (Manage Teams)
 * Route: /dashboard/admin/teams/[id]/players
 */

interface Player { id: string; name: string; position: string; squadNumber: number; teamId?: string; teamName?: string; isCaptain?: boolean; }
interface Team { id: string; name: string; players: Player[]; }

export default function TeamPlayersPage() {
    const { id } = useParams<{ id: string }>();
    const { data: team, loading, error, refetch } = useGet<Team>(`/teams/${id}`);
    const { data: allPlayers } = useGet<Player[]>('/players?unassigned=true');
    const { post: assignPlayer, isPending: assigning } = usePost(`/teams/${id}/players`);
    const { post: setCaptain } = usePost(`/teams/${id}/captain`);
    const { post: removePlayer } = usePost(`/teams/${id}/players/remove`);

    const [search, setSearch] = useState('');
    const [showAddPanel, setShowAddPanel] = useState(false);

    const unassigned = (allPlayers ?? []).filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAssign = async (playerId: string) => {
        await assignPlayer({ playerId });
        refetch();
    };

    const handleSetCaptain = async (playerId: string) => {
        await setCaptain({ playerId });
        refetch();
    };

    const handleRemove = async (playerId: string) => {
        await removePlayer({ playerId });
        refetch();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-400" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <Link href={`/dashboard/admin/teams/${id}`} className="inline-flex items-center text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> {team?.name ?? 'Team'}
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2"><Users className="w-6 h-6 text-sky-400" /><h1 className="text-3xl font-bold">Manage Squad</h1></div>
                            <p className="text-slate-300 text-sm">Each player belongs to exactly one team at any given time (BR-TM-03). Transfers log history (BR-TM-04/09).</p>
                        </div>
                        <button onClick={() => setShowAddPanel(p => !p)} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Player
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Current Squad */}
                    <div className={`${showAddPanel ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <h2 className="font-bold text-slate-800">Current Squad ({team?.players.length ?? 0})</h2>
                            </div>
                            {!team?.players.length ? (
                                <div className="p-12 text-center"><Users className="w-12 h-12 text-slate-200 mx-auto mb-4" /><p className="text-slate-500">No players assigned.</p></div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {(team?.players ?? []).map(player => (
                                        <div key={player.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{player.squadNumber}</span>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-slate-800">{player.name}</span>
                                                        {player.isCaptain && <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-label="Captain" />}
                                                    </div>
                                                    <span className="text-xs text-slate-500">{player.position}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleSetCaptain(player.id)} title={player.isCaptain ? 'Current captain' : 'Set as captain'} className={`p-2 rounded-lg transition-colors ${player.isCaptain ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}>
                                                    <Star className="w-4 h-4" />
                                                </button>
                                                <Link href={`/dashboard/admin/players/${player.id}/edit`} title="Transfer player" className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                                                    <ArrowRightLeft className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleRemove(player.id)} title="Remove from team" className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Player Panel */}
                    {showAddPanel && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="font-bold text-slate-800">Unassigned Players</h2>
                                <button onClick={() => setShowAddPanel(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="p-4">
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="text" placeholder="Search players..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" />
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                {unassigned.length === 0 ? (
                                    <div className="p-6 text-center"><p className="text-sm text-slate-500">No unassigned players found.</p></div>
                                ) : unassigned.map(player => (
                                    <div key={player.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                                        <div>
                                            <p className="font-medium text-slate-800 text-sm">{player.name}</p>
                                            <p className="text-xs text-slate-500">{player.position}</p>
                                        </div>
                                        <button onClick={() => handleAssign(player.id)} disabled={assigning} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors flex items-center gap-1">
                                            {assigning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
