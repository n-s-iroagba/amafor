'use client';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Save, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGet, usePut, useDelete } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

/**
 * @requirements REQ-ADV-02, REQ-ADV-07
 */

interface AdCreative {
    id: string;
    name: string;
    type: 'image' | 'video';
    url: string;
    status: 'active' | 'pending' | 'rejected';
    format: string;
    destinationUrl?: string; // e.g. where the ad clicks to
}


/**
 * Page: View Ad Creative
 * Description: Preview of an uploaded ad creative.
 * Requirements: REQ-ADV-08 (Creative Management)
 * User Story: US-ADV-008 (Manage Ad Creatives)
 * User Journey: UJ-ADV-002 (Manage Ad Campaigns)
 * API: GET /ads/creatives/:id (API_ROUTES.ADS.CREATIVES.DETAIL)
 */
export default function CreativeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;
    const creativeId = params.creativeId as string;

    const [name, setName] = useState('');
    const [destinationUrl, setDestinationUrl] = useState('');
    const [status, setStatus] = useState<'active' | 'paused'>('active');

    const { data: creative, loading: isLoading } = useGet<AdCreative>(
        `${API_ROUTES.ADS.CREATIVES.DETAIL(creativeId)}`
    );

    const { put: updateCreative, isPending: isUpdating } = usePut(
        `${API_ROUTES.ADS.CREATIVES.UPDATE(creativeId)}`,
        {
            onSuccess: () => {
                // Optional toast or feedback
            }
        }
    );

    const { delete: deleteCreative, isPending: isDeleting } = useDelete(
        API_ROUTES.ADS.CREATIVES.DELETE,
        {
            onSuccess: () => {
                router.push(`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives`);
            }
        }
    );

    useEffect(() => {
        if (creative) {
            setName(creative.name);
            setDestinationUrl(creative.destinationUrl || '');
            // Map status if needed, simplified for this example
            if (creative.status === 'active') setStatus('active');
            else if (creative.status !== 'pending' && creative.status !== 'rejected') setStatus('paused');
        }
    }, [creative]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateCreative({
            name,
            destinationUrl,
            status: status === 'paused' ? 'paused' : 'active' // Simplified mapping
        });
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this creative? Cannot be undone.')) {
            await deleteCreative(creativeId);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!creative) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-4">Creative not found</p>
                <Link href={`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives`} className="text-[#87CEEB] hover:underline">
                    Return to List
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href={`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives`} className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3 mr-2" /> Back to Creatives
                </Link>

                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl text-[#2F4F4F] uppercase tracking-tight font-black">Edit Creative</h1>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${creative.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {creative.status}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Preview Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video flex items-center justify-center relative group">
                            {creative.type === 'video' ? (
                                <video src={creative.url} controls className="w-full h-full object-contain" />
                            ) : (
                                <img src={creative.url} alt={creative.name} className="w-full h-full object-contain" />
                            )}
                            <a href={creative.url} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-[#2F4F4F] uppercase mb-4">Meta Information</h3>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Type</span>
                                    <span className="font-bold text-[#2F4F4F] uppercase">{creative.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Format</span>
                                    <span className="font-bold text-[#2F4F4F]">{creative.format}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Resolution</span>
                                    <span className="font-bold text-[#2F4F4F]">1920x1080</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Creative Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-[#2F4F4F] font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Destination URL</label>
                                    <input
                                        type="url"
                                        value={destinationUrl}
                                        onChange={(e) => setDestinationUrl(e.target.value)}
                                        placeholder="https://"
                                        className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-[#2F4F4F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-[#2F4F4F]"
                                    >
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                    </select>
                                </div>

                                <div className="pt-6 flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-1 py-4 bg-[#2F4F4F] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#1a2f2f] transition-all flex items-center justify-center space-x-2"
                                    >
                                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        <span>Save Changes</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
