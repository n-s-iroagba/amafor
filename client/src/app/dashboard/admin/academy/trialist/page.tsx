'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ROUTES } from '@/config/routes';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';


interface Trialist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  position: string;
  preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
  height?: number;
  weight?: number;
  previousClub?: string;
  videoUrl?: string;
  cvUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'INVITED' | 'REJECTED';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TrialistResponse {
  data: Trialist[];
}

export default function TrialistsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string>('');

  const { data, refetch, loading } = useGet<TrialistResponse>(
    API_ROUTES.COACHES.LIST
  );
  // const { handleDelete: deleteTrialist, deleting: deleteLoading } = useDelete(
  //   API_ROUTES.TRIALISTS.MUTATE(deletingId)
  // );

  const trialists = data?.data;

  const filteredTrialists = trialists?.filter((trialist) => {
    const matchesSearch = 
      trialist.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trialist.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trialist.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trialist.status === statusFilter;
    const matchesPosition = positionFilter === 'all' || trialist.position === positionFilter;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800';
      case 'INVITED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trialist? This action cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    try {
      // await deleteTrialist();
      await refetch();
    } catch (err) {
      console.error('Error deleting trialist:', err);
    } finally {
      setDeletingId('');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto sm:mx-0 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 border-b border-gray-100 flex items-center px-6">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24 ml-6"></div>
                <div className="h-8 bg-gray-200 rounded w-24 ml-6"></div>
                <div className="flex gap-2 ml-6">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12 text-center sm:text-left"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
          <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-600 flex-shrink-0" />
          <span className="text-center sm:text-left leading-tight">
            Trialists
          </span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto sm:mx-0 px-2 sm:px-0">
          Manage trialists and review applications
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search trialists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="INVITED">Invited</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Positions</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Forward">Forward</option>
          </select>
        </div>

        {/* Add Trialist Button */}
        <Link
          href="/sports-admin/trialist/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-medium rounded-lg shadow hover:from-emerald-700 hover:to-green-800 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Trialist
        </Link>
      </div>

      {/* Trialists Table */}
      {filteredTrialists && filteredTrialists.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrialists.map((trialist) => (
                  <tr key={trialist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {trialist.firstName} {trialist.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {trialist.dob ? Math.floor((new Date().getTime() - new Date(trialist.dob).getTime()) / 3.15576e10) : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{trialist.email}</div>
                        <div className="text-gray-500">{trialist.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{trialist.position}</div>
                      <div className="text-xs text-gray-500">
                        {trialist.height && `${trialist.height}cm`}
                        {trialist.height && trialist.weight && ' • '}
                        {trialist.weight && `${trialist.weight}kg`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trialist.status)}`}>
                        {trialist.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/trialists/${trialist.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Link>
                        <Link
                          href={`/sports-admin/trialist/${trialist.id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Link>
                        {/* <button
                          onClick={() => handleDelete(trialist.id)}
                          disabled={deletingId === trialist.id || deleteLoading}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3 h-3" />
                          {deletingId === trialist.id || deleteLoading ? 'Deleting...' : 'Delete'}
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' || positionFilter !== 'all'
              ? 'No matching trialists'
              : 'No trialists yet'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {searchTerm || statusFilter !== 'all' || positionFilter !== 'all'
              ? "We couldn't find any trialists matching your search or filters. Try adjusting them."
              : "Start by adding your first trialist to the system."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!(searchTerm || statusFilter !== 'all' || positionFilter !== 'all') && (
              <Link
                href="/sports-admin/trialist/new"
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Trialist
              </Link>
            )}
            {(searchTerm || statusFilter !== 'all' || positionFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPositionFilter('all');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {filteredTrialists && filteredTrialists.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-emerald-600">{filteredTrialists.length}</div>
            <div className="text-sm text-gray-500">Total Trialists</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredTrialists.filter(t => t.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-500">Pending Review</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {filteredTrialists.filter(t => t.status === 'INVITED').length}
            </div>
            <div className="text-sm text-gray-500">Invited</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {filteredTrialists.filter(t => t.status === 'REVIEWED').length}
            </div>
            <div className="text-sm text-gray-500">Reviewed</div>
          </div>
        </div>
      )}
    </div>
  );
}