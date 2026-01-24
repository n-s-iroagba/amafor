'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users,
  Search,

  Edit,
  Trash2,
  Eye,
  UserPlus,

  Loader2,
  AlertCircle,
  Shield,
  Award,
  Briefcase,
  Stethoscope,
  UserCheck,

  Download,
  Share2,
  MoreVertical
} from 'lucide-react';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
import { AcademyStaff, PaginatedData } from '@/shared/types';
import { DeletionConfirmationModal } from '@/shared/components/DeleteModal';
import { API_ROUTES } from '@/config/routes';



/**
 * Page: Academy Staff Management
 * Description: List and management of academy coaching and support staff.
 * Requirements: REQ-ADM-10 (Staff Management)
 * User Story: US-ADM-010 (Manage Staff)
 * User Journey: UJ-ADM-006 (Academy Ops)
 * API: GET /academy-staff (API_ROUTES.STAFF.LIST), DELETE /academy-staff/:id
 * Hook: useGet(API_ROUTES.STAFF.LIST), useDelete(API_ROUTES.STAFF.LIST)
 */
export default function AcademyStaffPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name_asc');
  const [selectedStaff, setSelectedStaff] = useState<AcademyStaff | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch staff data
  const {
    data,
    loading,
    error,
    refetch
  } = useGet<PaginatedData<AcademyStaff>>(API_ROUTES.STAFF.LIST, {
    params: {
      sort: 'name',
      limit: 100
    }
  });

  // Delete staff member
  const {
    delete: deleteStaff,
    isPending: deleting,
    error: deleteError
  } = useDelete<AcademyStaff>(API_ROUTES.STAFF.LIST); // Base URL for deletion, ID will be appended

  const staffData = data?.data || [];

  // Filter and sort staff
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || staff.category === categoryFilter;

    return matchesSearch && matchesCategory;
  }) || [];

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'experience_desc':
        return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
      case 'experience_asc':
        return (a.yearsOfExperience || 0) - (b.yearsOfExperience || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'coaching':
        return <Award className="h-4 w-4 text-blue-600" />;
      case 'medical':
        return <Stethoscope className="h-4 w-4 text-green-600" />;
      case 'administrative':
        return <Briefcase className="h-4 w-4 text-purple-600" />;
      case 'technical':
        return <Shield className="h-4 w-4 text-orange-600" />;
      case 'scouting':
        return <UserCheck className="h-4 w-4 text-yellow-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'coaching':
        return 'bg-blue-100 text-blue-800';
      case 'medical':
        return 'bg-green-100 text-green-800';
      case 'administrative':
        return 'bg-purple-100 text-purple-800';
      case 'technical':
        return 'bg-orange-100 text-orange-800';
      case 'scouting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (staff: AcademyStaff) => {
    setSelectedStaff(staff);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;

    try {
      await deleteStaff(selectedStaff.id);
      refetch();
      setShowDeleteModal(false);
      setSelectedStaff(null);
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const handleEdit = (staff: AcademyStaff) => {
    router.push(`/dashboard/admin/academy/staff/${staff.id}/edit`);
  };

  const handleViewDetails = (staff: AcademyStaff) => {
    router.push(`/dashboard/admin/academy/staff/${staff.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading academy staff...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-2">Error Loading Staff</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Academy Staff</h1>
              <p className="text-slate-300">
                Manage the coaching, medical, and administrative staff of the academy
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4" />
                Refresh
              </button>
              <Link
                href="/dashboard/admin/academy/staff/new"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Staff
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {staffData?.length || 0}
                </div>
                <div className="text-sm text-slate-600">Total Staff</div>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {staffData?.filter(s => s.category === 'coaching').length || 0}
                </div>
                <div className="text-sm text-slate-600">Coaching Staff</div>
              </div>
              <Award className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {staffData?.filter(s => s.category === 'medical').length || 0}
                </div>
                <div className="text-sm text-slate-600">Medical Staff</div>
              </div>
              <Stethoscope className="h-8 w-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {Math.round(
                    (staffData?.reduce((sum, staff) => sum + (staff.yearsOfExperience || 0), 0) || 0) /
                    (staffData?.length || 1)
                  )}
                </div>
                <div className="text-sm text-slate-600">Avg. Experience (years)</div>
              </div>
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search staff by name, role, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="all">All Categories</option>
                <option value="coaching">Coaching</option>
                <option value="medical">Medical</option>
                <option value="administrative">Administrative</option>
                <option value="technical">Technical</option>
                <option value="scouting">Scouting</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="experience_desc">Experience (High to Low)</option>
                <option value="experience_asc">Experience (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {sortedStaff.length} of {staffData?.length || 0} staff members
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        {sortedStaff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedStaff.map((staff) => (
              <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Staff Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {staff.imageUrl ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100">
                            <Image
                              src={staff.imageUrl}
                              alt={staff.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center text-white text-xl font-bold">
                            {staff.initials || staff.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-slate-200">
                          {getCategoryIcon(staff.category)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{staff.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(staff.category)}`}>
                            {staff.category || 'General'}
                          </span>
                          {staff.yearsOfExperience && (
                            <span className="text-xs text-slate-600">
                              {staff.yearsOfExperience}+ years
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <MoreVertical className="h-5 w-5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-700 mb-1">{staff.role}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{staff.bio}</p>
                  </div>

                  {/* Qualifications */}
                  {staff.qualifications && staff.qualifications.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {staff.qualifications.slice(0, 3).map((qual, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium"
                          >
                            {qual}
                          </span>
                        ))}
                        {staff.qualifications.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                            +{staff.qualifications.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleViewDetails(staff)}
                      className="px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(staff)}
                        className="px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No staff found</h3>
            <p className="text-slate-500 mb-6">
              {staffData?.length === 0
                ? "No staff members have been added yet."
                : "Try adjusting your search or filters."}
            </p>
            {staffData?.length === 0 && (
              <Link
                href="/dashboard/admin/academy/staff/new"
                className="inline-block px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Add First Staff Member
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <DeletionConfirmationModal


        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStaff(null);
        }}
        handleDelete={confirmDelete}
        isDeleting={deleting}
        message={`Are you sure you want to delete ${selectedStaff?.name}? This action cannot be undone.`} error={''} />}
    </div>
  );
}
