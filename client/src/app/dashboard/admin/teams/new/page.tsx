/**
 * Create New Team
 * 
 * Registration interface for adding new teams to the system with branding and affiliation details.
 * 
 * @screen SC-127
 * @implements REQ-SPT-07
 * @usecase UC-SPT-07 (Manage Teams)
 * @requires SRS-I-074 (Teams API - POST /admin/teams)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-072 Track team registration volume and branding asset upload success
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Upload, Loader2, AlertCircle } from 'lucide-react';
import { usePost } from '@/shared/hooks/useApiQuery';

export default function NewTeamPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [formError, setFormError] = useState('');

    const { post, isPending, error } = usePost<{ id: string }>('/teams');

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { setFormError('Team name is required.'); return; }
        setFormError('');
        const fd = new FormData();
        fd.append('name', name.trim());
        fd.append('description', description.trim());
        if (logoFile) fd.append('logo', logoFile);
        const result = await post(fd as any);
        if (result?.id) router.push(`/dashboard/admin/teams/${result.id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-3xl px-4 py-8">
                    <Link href="/dashboard/admin/teams" className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Teams
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-600 p-2 rounded-xl"><Shield className="w-5 h-5 text-white" /></div>
                        <h1 className="text-3xl font-bold">New Team</h1>
                    </div>
                    <p className="text-sky-300 text-sm mt-2">Create a team. Players can be assigned after creation (BR-TM-01).</p>
                </div>
            </div>

            <div className="container mx-auto max-w-3xl px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-sky-200 p-8 space-y-6">
                    {(formError || error) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                            <p className="text-sm text-red-700">{formError || error}</p>
                        </div>
                    )}

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-sky-700 mb-2">Team Logo</label>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-sky-300 flex items-center justify-center bg-sky-50 overflow-hidden">
                                {logoPreview ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-sky-400" />}
                            </div>
                            <div>
                                <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg text-sm font-medium transition-colors">
                                    Choose Image
                                </label>
                                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                <p className="text-xs text-sky-500 mt-1">PNG, JPG up to 2MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-sky-700 mb-2">Team Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Amafor FC First Team"
                            className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-sky-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Brief description of the team..."
                            rows={4}
                            className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-sky-200">
                        <Link href="/dashboard/admin/teams" className="px-6 py-3 text-sky-600 hover:text-sky-800 text-sm font-medium transition-colors">Cancel</Link>
                        <button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="px-8 py-3 bg-sky-800 text-white rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Team
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
