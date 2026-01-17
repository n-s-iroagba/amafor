'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ROUTES } from '@/config/routes';

import Image from 'next/image';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';

interface Coach {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface CoachResponse {
  data: Coach[];
}

export default function CoachesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<number>(0);

  const { data, refetch, loading } = useGet<CoachResponse>(
    API_ROUTES.COACHES.LIST
  );
  const {mutate: deleteCoach, isPending: deleteLoading } = useDelete(
    API_ROUTES.COACHES.MUTATE(deletingId)
  );

  const coaches = data?.data;

  const filteredCoaches = coaches?.filter((coach) => {
    const matchesSearch = coach.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || coach.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this coach? This action cannot be undone.'
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteCoach('');
      await refetch();
    } catch (err) {
      console.error('Error deleting coach:', err);
    } finally {
      setDeletingId(0);
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
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Coaches Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-5 border border-gray-200 rounded-xl bg-white animate-pulse"
            >
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          ))}
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
          <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-sky-600 flex-shrink-0" />
          <span className="text-center sm:text-left leading-tight">
            Coaches
          </span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto sm:mx-0 px-2 sm:px-0">
          Manage and review all registered coaches in the system
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coaches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Roles</option>
            <option value="Head Coach">Head Coach</option>
            <option value="Assistant Coach">Assistant Coach</option>
            <option value="Fitness Coach">Fitness Coach</option>
          </select>
        </div>

        {/* Add Coach Button */}
        <Link
          href="/sports-admin/coach/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-medium rounded-lg shadow hover:from-sky-700 hover:to-blue-800 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Coach
        </Link>
      </div>

      {/* Coaches List / Empty State */}
      {filteredCoaches && filteredCoaches.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCoaches.map((coach) => (
            <div
              key={coach.id}
              className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col"
            >
              <Image
                width={50}
                height={50}
                src={coach.imageUrl}
                alt={coach.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
                unoptimized={true}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {coach.name}
              </h3>
              <p className="text-sm text-sky-600 font-medium mb-2">
                {coach.role}
              </p>
              <p className="text-sm text-gray-600 flex-1">{coach.bio}</p>
              <div className="mt-4 text-xs text-gray-400">
                <p>
                  Created:{' '}
                  {coach.createdAt
                    ? new Date(coach.createdAt).toLocaleDateString()
                    : '—'}
                </p>
                <p>
                  Updated:{' '}
                  {coach.updatedAt
                    ? new Date(coach.updatedAt).toLocaleDateString()
                    : '—'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Link
                  href={`/sports-admin/coach/${coach.id}/edit`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200 transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(coach.id)}
                  disabled={deletingId === coach.id || deleteLoading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === coach.id || deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-sky-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || roleFilter !== 'all'
              ? 'No matching coaches'
              : 'No coaches yet'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {searchTerm || roleFilter !== 'all'
              ? "We couldn't find any coaches matching your search or filters. Try adjusting them."
              : "Start building your coaching roster by adding your first coach."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!(searchTerm || roleFilter !== 'all') && (
              <Link
                href="/sports-admin/coach/new"
                className="inline-flex items-center gap-2 px-5 py-3 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Coach
              </Link>
            )}
            {(searchTerm || roleFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
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
    </div>
  );
}