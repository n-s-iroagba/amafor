// app/sports-admin/leagues/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDelete, useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import api from '@/shared/lib/axios';
import {
  Calendar,
  Users,
  Trophy,
  Edit3,
  Trash2,
  ArrowLeft,
  Loader2,
  Shield,
  Clock,
  AlertCircle,
  BarChart3,
  Gamepad2,
  Plus,
  Eye,
  Settings
} from 'lucide-react';

interface League {
  id: number;
  name: string;
  season: string;
  isFriendly: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function LeagueDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: league, loading } = useGet<League>(
    API_ROUTES.LEAGUES.VIEW(id)
  );

  const { delete: deleteLeague, isPending: isDeleting } = useDelete(
    (id) => API_ROUTES.LEAGUES.MUTATE(Number(id))
  );

  const handleDelete = async () => {
    if (!league) return;

    try {
      await deleteLeague(league.id);
      router.push('/dashboard/admin/leagues');
      router.refresh();
    } catch (error) {
      console.error('Error deleting league:', error);
      alert('Failed to delete league. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    if (window.confirm(
      `Are you sure you want to delete the "${league?.name}" league? This action cannot be undone and will remove all associated fixtures and data.`
    )) {
      handleDelete();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
          </div>
          <p className="text-blue-700 font-medium text-lg">Loading league details...</p>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-6">
            <AlertCircle className="w-16 h-16 text-red-400 relative z-10" />
            <div className="absolute inset-0 bg-red-100 rounded-full blur-md animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            League Not Found
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            The league you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/sports-admin/leagues"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Leagues
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <Link
                href="/dashboard/admin/leagues"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group mb-4"
              >
                <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Leagues</span>
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {league.name}
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Season {league.season} • {league.isFriendly ? 'Friendly League' : 'Competitive League'}
                  </p>
                </div>

                {/* Mobile Actions */}
                <div className="flex sm:hidden gap-3">
                  <Link
                    href={`/dashboard/admin/leagues/${league.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-3">
              <Link
                href={`/dashboard/admin/leagues/${league.id}/edit`}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit League
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - League Overview & Quick Actions */}
          <div className="lg:col-span-8 space-y-6">
            {/* League Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">League Overview</h2>
                    <p className="text-gray-600">Complete league information and details</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Created Date</p>
                        <p className="text-gray-900 font-semibold">{formatDate(league.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">League Type</p>
                        <p className="text-gray-900 font-semibold">
                          {league.isFriendly ? 'Friendly Series' : 'Official Competition'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-gray-900 font-semibold">{formatDate(league.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="text-gray-900 font-semibold">Active & Running</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Link */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link
                    href={`/dashboard/admin/leagues/${league.id}/league-statstics`}
                    className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 text-blue-700 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-300 border border-blue-200 hover:border-blue-300 font-medium group"
                  >
                    <BarChart3 className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                    View Detailed League Statistics
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href={`/sports-admin/fixtures`}
                  className="group p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    View Fixtures
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Browse all matches in this league
                  </p>
                </Link>



                <Link
                  href={`/sports-admin/lineups?league=${league.id}`}
                  className="group p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <Gamepad2 className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                    Manage Lineups
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Set up team formations
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Management & Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* League Management Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                League Management
              </h3>

              <div className="space-y-3">
                <Link
                  href={`/dashboard/admin/leagues/${league.id}/edit`}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md font-medium group"
                >
                  <Edit3 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                  Edit League Details
                </Link>

                {showDeleteConfirm ? (
                  <div className="space-y-3 p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-700 font-medium text-center">
                      Confirm deletion?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {isDeleting ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-sm hover:shadow-md font-medium group"
                  >
                    <Trash2 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                    Delete League
                  </button>
                )}
              </div>
            </div>

            {/* League Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-600" />
                League Information
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">League ID</span>
                  <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">#{league.id}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Season</span>
                  <span className="text-sm font-semibold text-gray-900">{league.season}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-600">Competition Type</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${league.isFriendly
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                    }`}>
                    {league.isFriendly ? 'Friendly' : 'Competitive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Danger Zone
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Deleting this league will permanently remove all associated fixtures, goals, lineups, and statistics. This action cannot be undone.
              </p>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                )}
                {isDeleting ? 'Deleting League...' : 'Delete League Permanently'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}