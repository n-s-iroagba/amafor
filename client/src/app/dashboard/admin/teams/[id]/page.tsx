/**
 * Admin Team Detail
 * 
 * Comprehensive management hub for a specific team, including roster overview and administrative actions.
 * 
 * @screen SC-128
 * @implements REQ-SPT-07
 * @usecase UC-SPT-07 (Manage Teams)
 * @requires SRS-I-075 (Teams API - GET /admin/teams/:id)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-073 Monitor administrative depth into team profiles and roster management modules
 */
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Shield, Users, Star, Edit, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';

interface Player { id: string; name: string; position: string; squadNumber: number; imageUrl?: string; isCaptain?: boolean; }
interface TeamDetail { id: string; name: string; logo?: string; description?: string; isActive: boolean; players: Player[]; createdAt: string; }

export default function TeamDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: team, loading, error } = useGet<TeamDetail>(`/teams/${id}`);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-sky-400" /></div>;
    if (error || !team) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex items-start gap-3 max-w-md">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                    <p className="font-medium text-red-800">Failed to load team</p>
                    <Link href="/dashboard/admin/teams" className="text-sm text-red-700 underline mt-2 block">← Back to teams</Link>
                </div>
            </div>
        </div>
    );

    const captain = team.players.find(p => p.isCaptain);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <Link href="/dashboard/admin/teams" className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Teams
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden">
                                {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" /> : <Shield className="w-8 h-8 text-white/60" />}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{team.name}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${team.isActive ? 'bg-green-500/20 text-green-300' : 'bg-sky-500/20 text-sky-300'}`}>
                                        {team.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="text-sky-400 text-sm">{team.players.length} players</span>
                                    {captain && <span className="text-sky-400 text-sm flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {captain.name}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href={`/dashboard/admin/teams/${id}/players`} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <Users className="w-4 h-4" /> Manage Players
                            </Link>
                            <Link href={`/dashboard/admin/teams/${id}/edit`} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <Edit className="w-4 h-4" /> Edit Team
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {team.description && (
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-6 mb-6">
                        <p className="text-sky-600">{team.description}</p>
                    </div>
                )}

                {/* Player roster */}
                <div className="bg-white rounded-xl shadow-sm border border-sky-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-sky-200 flex items-center justify-between">
                        <h2 className="font-bold text-sky-800">Squad ({team.players.length})</h2>
                        <Link href={`/dashboard/admin/teams/${id}/players`} className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1">
                            Manage <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {team.players.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-12 h-12 text-sky-200 mx-auto mb-4" />
                            <p className="text-sky-500 mb-4">No players assigned yet.</p>
                            <Link href={`/dashboard/admin/teams/${id}/players`} className="px-6 py-2 bg-sky-800 text-white rounded-lg text-sm hover:bg-sky-700 transition-colors">
                                Assign Players
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-sky-100">
                            {team.players.map(player => (
                                <div key={player.id} className="px-6 py-4 flex items-center justify-between hover:bg-sky-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sm font-bold text-sky-500">
                                            {player.squadNumber}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sky-800">{player.name}</span>
                                                {player.isCaptain && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                            </div>
                                            <span className="text-sm text-sky-500">{player.position}</span>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/admin/players/${player.id}`} className="text-xs text-sky-400 hover:text-sky-600 transition-colors">View Profile</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
