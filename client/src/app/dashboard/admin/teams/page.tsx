/**
 * Admin Team Registry
 * 
 * Directory of all football teams participating in AGFC leagues, including club affiliations and status.
 * 
 * @screen SC-126
 * @implements REQ-SPT-07
 * @usecase UC-SPT-07 (Manage Teams)
 * @requires SRS-I-073 (Teams API - GET /admin/teams)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-071 Monitor team directory engagement and club registration trends
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Plus, Users, ChevronRight, Search, Loader2, AlertCircle, Star } from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

/**
 * Page: Team List & Management (Admin)
 * Screen ID: SC-126
 * Description: Lists all teams with player count and links to team management.
 * BRD Requirements: BR-TM-01, BR-TM-05
 * User Journey: UJ-ADM-013 (Manage Teams)
 * Route: /dashboard/admin/teams
 */

interface Team {
    id: string;
    name: string;
    logo?: string;
    description?: string;
    playerCount: number;
    captain?: string;
    isActive: boolean;
}

export default function TeamListPage() {
    const [search, setSearch] = useState('');
    const { data: teams, loading, error, refetch } = useGet<Team[]>('/teams');

    const filtered = (teams ?? []).filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <Link href="/dashboard/admin" className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-sky-600 p-2 rounded-xl"><Shield className="w-5 h-5 text-white" /></div>
                                <h1 className="text-3xl font-bold">Teams</h1>
                            </div>
                            <p className="text-sky-300 text-sm">Create, manage, and assign players to teams. Each player belongs to exactly one team (BR-TM-03).</p>
                        </div>
                        <Link
                            href="/dashboard/admin/teams/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm font-medium transition-colors"
                            data-testid="btn-new-team"
                        >
                            <Plus className="w-4 h-4" /> New Team
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                            <p className="font-medium text-red-800">Failed to load teams</p>
                            <button onClick={() => refetch()} className="mt-2 text-sm text-red-700 underline">Retry</button>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-12 text-center">
                        <Shield className="w-12 h-12 text-sky-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-sky-700 mb-2">No teams found</h3>
                        <Link href="/dashboard/admin/teams/new" className="inline-block mt-4 px-6 py-3 bg-sky-800 text-white rounded-lg text-sm hover:bg-sky-700 transition-colors">
                            Create First Team
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(team => (
                            <div key={team.id} className="bg-white rounded-xl shadow-sm border border-sky-200 p-6 hover:shadow-md transition-shadow group" data-testid={`team-card-${team.id}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-2xl font-black text-sky-400">
                                            {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-xl" /> : team.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sky-800">{team.name}</h3>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${team.isActive ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-600'}`}>
                                                {team.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {team.description && <p className="text-sm text-sky-500 mb-4 line-clamp-2">{team.description}</p>}
                                <div className="flex items-center gap-4 text-sm text-sky-600 mb-4">
                                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {team.playerCount} players</span>
                                    {team.captain && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {team.captain}</span>}
                                </div>
                                <Link
                                    href={`/dashboard/admin/teams/${team.id}`}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-sky-100 hover:bg-sky-800 hover:text-white rounded-lg text-sm font-medium transition-colors text-sky-700"
                                >
                                    Manage Team <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
