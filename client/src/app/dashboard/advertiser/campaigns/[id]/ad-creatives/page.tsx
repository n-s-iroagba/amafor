'use client';
import React from 'react';
import { PlusCircle, ArrowLeft, Image as ImageIcon, Trash2, Loader2, Eye, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
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
    impressions: number;
    clicks: number;
    format: string; // e.g., "300x250"
}

/**
 * Page: Campaign Creatives
 * Description: Manage media assets for a specific campaign.
 * Requirements: REQ-ADV-08 (Creative Management)
 * User Story: US-ADV-008 (Manage Ad Creatives)
 * User Journey: UJ-ADV-002 (Manage Ad Campaigns)
 * API: GET /advertiser/campaigns/:id/creatives (API_ROUTES.ADVERTISER.CAMPAIGNS.CREATIVES)
 */
export default function CreativesListPage() {
    const params = useParams();
    const campaignId = params.id as string;

    const { data: creatives, loading, refetch } = useGet<AdCreative[]>(
        API_ROUTES.ADVERTISER.CAMPAIGNS.CREATIVES(campaignId)
    );

    const { delete: deleteCreative, isPending: isDeleting } = useDelete(
        API_ROUTES.ADS.CREATIVES.DELETE,
        {
            onSuccess: () => refetch(),
        }
    );

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this creative?')) {
            await deleteCreative(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <Link href={`/dashboard/advertiser/campaigns/${campaignId}`} className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3 mr-2" /> Back to Campaign
                </Link>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight font-black">Ad Creatives</h1>
                        <p className="text-gray-500 text-sm">Manage the visuals and media for this campaign.</p>
                    </div>
                    <Link href={`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives/new`} className="sky-button flex items-center space-x-3 py-4">
                        <PlusCircle className="w-5 h-5" />
                        <span>UPLOAD NEW CREATIVE</span>
                    </Link>
                </header>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : !creatives || creatives.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                            <ImageIcon className="w-16 h-16 mb-4 text-gray-200" />
                            <p>No creatives uploaded yet</p>
                            <Link href={`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives/new`} className="text-[#87CEEB] hover:underline mt-2 font-bold text-xs uppercase tracking-widest">
                                Upload your first ad
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                            {creatives.map((creative) => (
                                <div key={creative.id} className="group bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                        {creative.type === 'video' ? (
                                            <video src={creative.url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={creative.url} alt={creative.name} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                            <button onClick={() => handleDelete(creative.id)} disabled={isDeleting} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-[#2F4F4F] mb-1">{creative.name}</h3>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{creative.format} • {creative.type}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${creative.status === 'active' ? 'bg-green-100 text-green-600' :
                                                creative.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {creative.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                            <div>
                                                <div className="flex items-center text-gray-400 mb-1">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Views</span>
                                                </div>
                                                <div className="text-lg font-black text-[#2F4F4F]">{creative.impressions.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center text-gray-400 mb-1">
                                                    <MousePointer2 className="w-3 h-3 mr-1" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Clicks</span>
                                                </div>
                                                <div className="text-lg font-black text-[#2F4F4F]">{creative.clicks.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
