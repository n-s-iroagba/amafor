'use client';
import React, { useState } from 'react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Loader2, AlertCircle, Search, Filter, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Dispute {
    id: string;
    advertiser: {
        name: string;
        email: string;
    };
    subject: string;
    description: string;
    status: 'open' | 'investigation' | 'resolved' | 'closed';
    createdAt: string;
}

/**
 * Page: Admin Disputes List
 * Description: List of all disputes for admin review.
 * API: GET /disputes/admin/all (API_ROUTES.ADMIN.DISPUTES.LIST)
 */
export default function AdminDisputesPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const { data: response, loading, error } = useGet<{ success: boolean; data: Dispute[] }>(
        API_ROUTES.ADMIN.DISPUTES.LIST
    );

    const disputes = response?.data || [];

    const filteredDisputes = disputes.filter(dispute => {
        const matchesFilter = filter === 'all' || dispute.status === filter;
        const matchesSearch =
            dispute.subject.toLowerCase().includes(search.toLowerCase()) ||
            dispute.advertiser.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-700';
            case 'investigation': return 'bg-amber-100 text-amber-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return <ShieldAlert className="w-4 h-4" />;
            case 'resolved': return <CheckCircle className="w-4 h-4" />;
            case 'investigation': return <Clock className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#87CEEB]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>Error loading disputes: {String(error)}</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-[#2F4F4F]">DISPUTE RESOLUTION CENTER</h1>
                <p className="text-gray-500 mt-2">Manage and resolve advertiser disputes</p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search disputes or advertisers..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        data-testid="input-search-disputes"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {['all', 'open', 'investigation', 'resolved', 'closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            data-testid={`filter-btn-${status}`}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${filter === status
                                ? 'bg-[#2F4F4F] text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                {filteredDisputes.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-bold">No disputes found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredDisputes.map((dispute) => (
                            <Link
                                href={`/dashboard/admin/disputes/${dispute.id}`}
                                key={dispute.id}
                                className="block p-6 hover:bg-gray-50 transition-colors group"
                                data-testid={`dispute-row-${dispute.id}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className={`p-3 rounded-xl ${getStatusColor(dispute.status)} bg-opacity-20`}>
                                            {getStatusIcon(dispute.status)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#2F4F4F] group-hover:text-[#87CEEB] transition-colors" data-testid="dispute-subject">
                                                {dispute.subject}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                From: <span className="font-semibold text-gray-700">{dispute.advertiser?.name}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                ID: {dispute.id} • Opened: {new Date(dispute.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(dispute.status)}`} data-testid="dispute-status-badge">
                                        {dispute.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
