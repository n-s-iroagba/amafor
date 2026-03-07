/**
 * Edit Team Profile
 * 
 * Interface for modifying team branding, affiliation details, and active competitive status.
 * 
 * @screen SC-129
 * @implements REQ-SPT-07
 * @usecase UC-SPT-07 (Manage Teams)
 * @requires SRS-I-076 (Teams API - PUT /admin/teams/:id)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-074 Track team metadata modifications and branding asset updates
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Upload, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';

interface Team { id: string; name: string; logo?: string; description?: string; isActive: boolean; playerCount: number; }

export default function EditTeamPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: team, loading } = useGet<Team>(`/teams/${id}`);
    const { put, isPending, error } = usePut(`/teams/${id}`);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        if (team) { setName(team.name); setDescription(team.description ?? ''); setIsActive(team.isActive); setLogoPreview(team.logo ?? null); }
    }, [team]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', name.trim());
        fd.append('description', description.trim());
        fd.append('isActive', String(isActive));
        if (logoFile) fd.append('logo', logoFile);
        await put(fd as any);
        router.push(`/dashboard/admin/teams/${id}`);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-sky-400" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-3xl px-4 py-8">
                    <Link href={`/dashboard/admin/teams/${id}`} className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> {team?.name ?? 'Team'}
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-600 p-2 rounded-xl"><Shield className="w-5 h-5 text-white" /></div>
                        <h1 className="text-3xl font-bold">Edit Team</h1>
                    </div>
                </div>
            </div>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-sky-200 p-8 space-y-6">
                    {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-500 mt-0.5" /><p className="text-sm text-red-700">{error}</p></div>}

                    {/* Logo */}
                    <div>
                        <label className="block text-sm font-semibold text-sky-700 mb-2">Team Logo</label>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-sky-300 flex items-center justify-center bg-sky-50 overflow-hidden">
                                {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-sky-400" />}
                            </div>
                            <label htmlFor="logo-edit" className="cursor-pointer px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg text-sm font-medium transition-colors">
                                Change Logo <input id="logo-edit" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-sky-700 mb-2">Team Name <span className="text-red-500">*</span></label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-sky-700 mb-2">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm resize-none" />
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-sky-200">
                        <div>
                            <p className="font-semibold text-sky-800">Team Status</p>
                            <p className="text-xs text-sky-500 mt-0.5">
                                {team?.playerCount && team.playerCount > 0 ? `⚠ Cannot deactivate — ${team.playerCount} player(s) still assigned (BR-TM-05)` : 'No players assigned — safe to deactivate.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => { if (!team?.playerCount || team.playerCount === 0) setIsActive(a => !a); }}
                            disabled={Boolean(team?.playerCount && team.playerCount > 0 && isActive)}
                            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-sky-300'} ${team?.playerCount && team.playerCount > 0 && isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-sky-200">
                        <Link href={`/dashboard/admin/teams/${id}`} className="px-6 py-3 text-sky-600 hover:text-sky-800 text-sm font-medium">Cancel</Link>
                        <button type="submit" disabled={isPending} className="px-8 py-3 bg-sky-800 text-white rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
                        </button>
                    </div>
                </form>

                {/* Danger zone */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-100 p-6">
                    <h3 className="font-bold text-red-700 mb-1 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Danger Zone</h3>
                    <p className="text-sm text-sky-500 mb-4">Permanently delete this team. All player assignments must be removed first (BR-TM-05).</p>
                    <button disabled={Boolean(team?.playerCount && team.playerCount > 0)} className="px-6 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        Delete Team
                    </button>
                </div>
            </div>
        </div>
    );
}
