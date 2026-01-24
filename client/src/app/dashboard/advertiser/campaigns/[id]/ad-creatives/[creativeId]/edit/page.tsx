'use client';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface AdCreative {
    id: string;
    name: string;
    type: 'image' | 'video';
    url: string;
    status: 'active' | 'pending' | 'rejected';
    format: string;
    destinationUrl?: string;
}

export default function EditCreativePage() {
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
                router.push(`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives`);
            }
        }
    );

    useEffect(() => {
        if (creative) {
            setName(creative.name);
            setDestinationUrl(creative.destinationUrl || '');
            if (creative.status === 'active') setStatus('active');
            else if (creative.status !== 'pending' && creative.status !== 'rejected') setStatus('paused');
        }
    }, [creative]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateCreative({
            name,
            destinationUrl,
            status: status === 'paused' ? 'paused' : 'active'
        });
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
                </header>

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

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full py-4 bg-[#2F4F4F] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#1a2f2f] transition-all flex items-center justify-center space-x-2"
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
