'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Edit,
  Eye,
  Plus,
  Trash2,
  Loader2,
  Search,
  Filter,
  Users,
} from 'lucide-react';

import { API_ROUTES } from '@/config/routes';

import Image from 'next/image';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';

interface Patron {
  id: number;
  name: string;
  position: string;
  imageUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


/**
 * Page: Patron List
 * Description: Management of club patrons and supporters.
 * Requirements: REQ-ADM-12 (Patron Management)
 * User Story: US-ADM-014 (Manage Patrons)
 * User Journey: UJ-ADM-008 (Community Relations)
 * API: GET /patrons (API_ROUTES.PATRONS.LIST)
 * Hook: useGet(API_ROUTES.PATRONS.LIST)
 */
export default function PatronListPage() {
  const { data, loading, error, refetch } = useGet<{ data: Patron[] }>(
    API_ROUTES.PATRONS.LIST
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  const { delete: deletePatron, isPending: deleteLoading } = useDelete(
    API_ROUTES.PATRONS.DELETE
  );

  const patrons = data?.data || [];
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deletePatron(id);
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting patron. Please try again.');
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const confirmDelete = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Filter patrons based on search term
  const filteredPatrons = patrons?.filter(
    (patron) =>
      patron.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patron.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="app-container">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow-sm bg-white animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                    <div className="w-24 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-16 h-8 bg-gray-200 rounded" />
                  <div className="w-16 h-8 bg-gray-200 rounded" />
                  <div className="w-16 h-8 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Failed to Load Patrons
          </h2>
          <p className="text-gray-600 mb-6">
            There was an error loading the patron list.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Patrons</h1>
            <p className="text-gray-600">Manage your organization's patrons</p>
          </div>
        </div>

        <Link
          href="/dashboard/admin/patrons/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          data-testid="btn-add-patron"
        >
          <Plus className="w-4 h-4" />
          Add Patron
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patrons by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-search-patrons"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Patrons List */}
      <div className="space-y-4">
        {filteredPatrons?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No matching patrons found' : 'No patrons yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first patron'}
            </p>
            {!searchTerm && (
              <Link
                href="/dashboard/admin/patrons/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add First Patron
              </Link>
            )}
          </div>
        ) : (
          filteredPatrons?.map((patron) => (
            <div
              key={patron.id}
              className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
              data-testid="patron-card"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Patron Info */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <Image
                    width={50}
                    height={50}
                    unoptimized
                    src={patron.imageUrl || ''}
                    alt={patron.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-800 truncate">
                      {patron.name}
                    </h2>
                    <p className="text-gray-600 text-sm truncate">
                      {patron.position}
                    </p>
                    {patron.bio && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {patron.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/dashboard/admin/patrons/${patron.id}`}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </Link>

                  <Link
                    href={`/dashboard/admin/patrons/${patron.id}/edit`}
                    className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>

                  {showDeleteConfirm === patron.id ? (
                    <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                      <span className="text-sm text-red-700 font-medium">
                        Confirm?
                      </span>
                      <button
                        onClick={() => handleDelete(patron.id)}
                        disabled={deletingId === patron.id}
                        className="text-red-700 hover:text-red-800 disabled:opacity-50"
                      >
                        {deletingId === patron.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Yes'
                        )}
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => confirmDelete(patron.id)}
                      disabled={deletingId === patron.id}
                      className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === patron.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {deletingId === patron.id ? 'Deleting...' : 'Delete'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      {filteredPatrons && filteredPatrons.length > 0 && (
        <div className="mt-8 text-center text-gray-500 text-sm">
          Showing {filteredPatrons.length} of {patrons?.length} patrons
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
}
