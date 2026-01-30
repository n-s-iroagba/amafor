'use client';
import { useState } from 'react';
import { Plus, Search, Filter, Megaphone, Calendar, TrendingUp, MoreVertical, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { AdCampaign } from '@/features/advertisement/types';


/**
 * Page: Campaign List
 * Description: List of all advertising campaigns with status filters and search.
 * Requirements: REQ-ADV-03 (View Active & History)
 * User Story: US-ADV-004 (Manage Campaigns)
 * User Journey: UJ-ADV-002 (Campaign Management)
 * API: GET /advertiser/campaigns (API_ROUTES.ADVERTISER.CAMPAIGNS.LIST)
 * Hook: useGet(API_ROUTES.ADVERTISER.CAMPAIGNS.LIST)
 */
export default function CampaignsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: campaigns, loading } = useGet<AdCampaign[]>(API_ROUTES.ADVERTISER.CAMPAIGNS.LIST);

  const filteredCampaigns = campaigns?.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight font-black">Campaigns</h1>
            <p className="text-gray-500 text-sm">Manage and monitor your advertising campaigns.</p>
          </div>
          <Link href="/dashboard/advertiser/campaigns/new" className="sky-button flex items-center justify-center space-x-2 text-xs tracking-widest" data-testid="btn-create-campaign">
            <Plus className="w-4 h-4" />
            <span>NEW CAMPAIGN</span>
          </Link>
        </header>

        {/* Filters */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-8 flex flex-wrap items-center gap-6">
          <div className="flex-1 relative min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-[#87CEEB] transition-all"
              data-testid="input-search-campaigns"
            />
          </div>
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {['all', 'active', 'draft', 'completed', 'paused'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-[#2F4F4F] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                data-testid={`filter-btn-${f}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign List */}
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#87CEEB]" />
            <span className="text-xs uppercase tracking-widest font-bold">Loading Campaigns...</span>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map(campaign => (
              <Link href={`/dashboard/advertiser/campaigns/${campaign.id}`} key={campaign.id} className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1" data-testid={`campaign-card-${campaign.id}`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="bg-[#87CEEB]/10 p-4 rounded-2xl group-hover:bg-[#87CEEB] transition-colors duration-500">
                    <Megaphone className="w-6 h-6 text-[#87CEEB] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${campaign.status === 'active' ? 'bg-green-100 text-green-600' :
                    campaign.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                    {campaign.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#2F4F4F] mb-2 line-clamp-1 group-hover:text-[#87CEEB] transition-colors">{campaign.name}</h3>
                <div className="flex items-center text-xs text-gray-400 font-bold mb-6">
                  <Calendar className="w-3 h-3 mr-2" />
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Views</div>
                    <div className="text-lg font-black text-[#2F4F4F]">{campaign.viewsDelivered?.toLocaleString() || 0}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Spend</div>
                    <div className="text-lg font-black text-[#2F4F4F]">₦{Number(campaign.spent || 0).toLocaleString()}</div>
                  </div>
                </div>

                <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden mb-6">
                  <div
                    className="bg-[#2F4F4F] h-full transition-all duration-1000 group-hover:bg-[#87CEEB]"
                    style={{ width: `${Math.min(((campaign.viewsDelivered || 0) / (campaign.targetViews || 1)) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#87CEEB] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  <span>View Analytics</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-dashed border-gray-200">
            <div className="mx-auto bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-black text-[#2F4F4F] mb-2">No Campaigns Found</h3>
            <p className="text-gray-400 text-sm mb-8">Get started by creating your first advertising campaign.</p>
            <Link href="/dashboard/advertiser/campaigns/new" className="sky-button inline-flex items-center space-x-2 text-xs tracking-widest">
              <Plus className="w-4 h-4" />
              <span>CREATE CAMPAIGN</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}