/**
 * Ad Zone Configuration
 * 
 * Technical management interface for defining and configuring advertisement placement zones across the platform.
 * 
 * @screen SC-096
 * @implements REQ-ADM-09
 * @usecase UC-ADM-09 (Manage Ad Zones)
 * @requires SRS-I-084 (Advertising API - GET /admin/advertising/zones)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-083 Monitor ad zone configuration changes and placement distribution status
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Megaphone, DollarSign, Eye, Settings, AlertCircle, Loader2,
    ChevronRight, TrendingUp, FileWarning, Save
} from 'lucide-react';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface AdZone {
    id: string;
    identifier: string;
    name: string;
    perViewRate: number;
    currency: string;
    totalImpressions: number;
    activeCampaigns: number;
    placement: string;
}

export default function AdvertisingOverviewPage() {
    const { data: zones, loading, error, refetch } = useGet<AdZone[]>(API_ROUTES.ADS.ZONES.LIST);
    const [editingZone, setEditingZone] = useState<string | null>(null);
    const [rateInputs, setRateInputs] = useState<Record<string, string>>({});
    const { post: updateRate, isPending: saving } = usePost(API_ROUTES.ADS.ZONES.LIST);

    const handleSaveRate = async (zoneId: string) => {
        const newRate = parseFloat(rateInputs[zoneId] || '0');
        if (!newRate || newRate <= 0) return;
        await updateRate({ zoneId, perViewRate: newRate });
        setEditingZone(null);
        refetch();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <Link
                        href="/dashboard/admin"
                        className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-sky-600 p-2 rounded-xl">
                                    <Megaphone className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold">Advertising Overview</h1>
                            </div>
                            <p className="text-sky-300 text-sm">
                                Manage ad zones and per-view rates. Rate changes notify all advertisers 30 days in advance (BR-AD-11).
                            </p>
                        </div>
                        <Link
                            href="/dashboard/admin/advertisers"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Manage Advertisers <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Policy Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <FileWarning className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <span className="font-bold">BR-AD-11 Policy:</span> Any change to per-view rates must be communicated to all registered advertisers via email at least 30 days before the effective date.
                        Mid-article banners are inserted after the first 100 words of an article (BR-AD-17).
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-red-800">Failed to load ad zones</p>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                            <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm">Try Again</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-sky-600">Ad Zones</p>
                                        <p className="text-2xl font-bold text-sky-800">{zones?.length ?? 0}</p>
                                    </div>
                                    <Settings className="w-8 h-8 text-sky-300" />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-sky-600">Total Impressions</p>
                                        <p className="text-2xl font-bold text-sky-800">
                                            {(zones ?? []).reduce((s, z) => s + (z.totalImpressions ?? 0), 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <Eye className="w-8 h-8 text-sky-300" />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-sky-600">Active Campaigns</p>
                                        <p className="text-2xl font-bold text-sky-800">
                                            {(zones ?? []).reduce((s, z) => s + (z.activeCampaigns ?? 0), 0)}
                                        </p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-sky-300" />
                                </div>
                            </div>
                        </div>

                        {/* Zone Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-sky-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-200">
                                <h2 className="font-bold text-sky-800">Ad Zones & Per-View Rates</h2>
                            </div>
                            <div className="divide-y divide-sky-100">
                                {(zones ?? []).length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Megaphone className="w-12 h-12 text-sky-200 mx-auto mb-4" />
                                        <p className="text-sky-500">No ad zones configured yet.</p>
                                    </div>
                                ) : (zones ?? []).map((zone) => (
                                    <div key={zone.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                                                    <Megaphone className="w-5 h-5 text-sky-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sky-800">{zone.name}</p>
                                                    <p className="text-xs text-sky-500">{zone.identifier} · {zone.placement}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-sky-600">
                                            <span>{zone.totalImpressions?.toLocaleString() ?? 0} impressions</span>
                                            <span>{zone.activeCampaigns ?? 0} campaigns</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {editingZone === zone.id ? (
                                                <>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={rateInputs[zone.id] ?? zone.perViewRate}
                                                            onChange={(e) => setRateInputs(r => ({ ...r, [zone.id]: e.target.value }))}
                                                            className="pl-8 pr-3 py-2 border border-sky-300 rounded-lg text-sm w-36 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleSaveRate(zone.id)}
                                                        disabled={saving}
                                                        className="px-4 py-2 bg-sky-800 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
                                                    >
                                                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                        Save
                                                    </button>
                                                    <button onClick={() => setEditingZone(null)} className="px-3 py-2 text-sky-500 hover:text-sky-700 text-sm">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-sky-800">₦{zone.perViewRate?.toLocaleString()}/view</span>
                                                    <button
                                                        onClick={() => setEditingZone(zone.id)}
                                                        className="px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Edit Rate
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
