'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Loader2,
  Search,
  Filter,
  Package,
  DollarSign,
  Users,
  Zap,
  MapPin,
} from 'lucide-react';
import { useGet } from '@/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import api from '@/lib/apiUtils';

interface AdPlan {
  id: number;
  name: string;
  description: string | null;
  maxImpressions: number | null;
  zone: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export default function AdPlansPage() {
  const {
    data: adPlans,
    loading,
    error,
    refetch,
  } = useGet<AdPlan[]>(API_ROUTES.ADS.PLANS.LIST);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      await api.delete(API_ROUTES.ADS.PLANS.DELETE(id));
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting ad plan. Please try again.');
    } finally {
      setDeleteLoading(null);
      setShowDeleteConfirm(null);
    }
  };

  const confirmDelete = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Filter ad plans based on search term and zone
  const filteredAdPlans = adPlans?.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = zoneFilter === 'all' || plan.zone === zoneFilter;

    return matchesSearch && matchesZone;
  });

  const getZoneDisplayName = (zone: string) => {
    const zoneNames: { [key: string]: string } = {
      'top_banner': 'Top Banner',
      'footer_banner': 'Footer Banner'
    };
    return zoneNames[zone] || zone;
  };

  const getZoneBadgeColor = (zone: string) => {
    const zoneColors: { [key: string]: string } = {
      'top_banner': 'bg-blue-100 text-blue-800',
      'footer_banner': 'bg-purple-100 text-purple-800'
    };
    return zoneColors[zone] || 'bg-gray-100 text-gray-800';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-200 rounded-lg animate-pulse" />
              <div className="w-32 h-8 bg-sky-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-32 h-10 bg-sky-200 rounded-lg animate-pulse" />
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="p-6 border border-sky-200 rounded-lg shadow-sm bg-white animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-sky-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-sky-200 rounded" />
                      <div className="w-24 h-3 bg-sky-200 rounded" />
                      <div className="w-20 h-3 bg-sky-200 rounded" />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-16 h-8 bg-sky-200 rounded" />
                    <div className="w-16 h-8 bg-sky-200 rounded" />
                    <div className="w-16 h-8 bg-sky-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-sky-900 mb-2">
              Failed to Load Ad Plans
            </h2>
            <p className="text-sky-700 mb-6">
              There was an error loading the ad plans list.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Package className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-900">Ad Plans</h1>
              <p className="text-sky-700">
                Manage advertising plans and pricing
              </p>
            </div>
          </div>

          <Link
            href="/admin/ad-plans/new"
            className="flex items-center gap-2 bg-sky-600 text-white px-4 py-3 rounded-lg hover:bg-sky-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create Plan
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border border-sky-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plans by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sky-900"
            >
              <option value="all">All Zones</option>
              <option value="top_banner">Top Banner</option>
              <option value="footer_banner">Footer Banner</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-sky-300 rounded-lg hover:bg-sky-50 transition-colors text-sky-700">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Ad Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdPlans?.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-sky-200 shadow-sm">
              <Package className="w-16 h-16 text-sky-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-sky-900 mb-2">
                {searchTerm || zoneFilter !== 'all'
                  ? 'No matching plans found'
                  : 'No ad plans yet'}
              </h3>
              <p className="text-sky-700 mb-6">
                {searchTerm || zoneFilter !== 'all'
                  ? 'Try adjusting your search terms or filters'
                  : 'Get started by creating your first ad plan'}
              </p>
              {!searchTerm && zoneFilter === 'all' && (
                <Link
                  href="/admin/ad-plans/new"
                  className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create First Plan
                </Link>
              )}
            </div>
          ) : (
            filteredAdPlans?.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg border border-sky-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Plan Header */}
                <div className="p-6 border-b border-sky-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sky-900 text-lg">
                          {plan.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getZoneBadgeColor(plan.zone)}`}>
                            <MapPin className="w-3 h-3" />
                            {getZoneDisplayName(plan.zone)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-sky-700 text-sm line-clamp-2">
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Plan Details */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sky-700">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Price</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {parseFloat(plan.price.toString()).toFixed(2)} Naira
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sky-700">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Impressions</span>
                      </div>
                      <span className="font-semibold text-sky-900">
                        {plan.maxImpressions
                          ? plan.maxImpressions.toLocaleString()
                          : 'Unlimited'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sky-700">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Created</span>
                      </div>
                      <span className="text-sm text-sky-600">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 mt-4 border-t border-sky-100">
                    <Link
                      href={`/admin/ad-plans/${plan.id}`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>

                    <Link
                      href={`/admin/ad-plans/${plan.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    {showDeleteConfirm === plan.id ? (
                      <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <span className="text-xs text-red-700 font-medium">
                          Confirm?
                        </span>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          disabled={deleteLoading === plan.id}
                          className="text-red-700 hover:text-red-800 disabled:opacity-50 text-xs"
                        >
                          {deleteLoading === plan.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            'Yes'
                          )}
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-sky-600 hover:text-sky-800 text-xs"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => confirmDelete(plan.id)}
                        disabled={deleteLoading === plan.id}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm disabled:opacity-50"
                      >
                        {deleteLoading === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {filteredAdPlans && filteredAdPlans.length > 0 && (
          <div className="mt-8 text-center text-sky-600 text-sm">
            Showing {filteredAdPlans.length} of {adPlans?.length} ad plans
            {(searchTerm || zoneFilter !== 'all') && (
              <>
                {' '}
                matching {searchTerm && `"${searchTerm}"`}
                {searchTerm && zoneFilter !== 'all' && ' and '}
                {zoneFilter !== 'all' && `${getZoneDisplayName(zoneFilter)} zone`}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}