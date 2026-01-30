'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

import {
  Mail, Phone, Calendar, Ruler, Weight, Footprints,
  Award, Video, FileText, Clock, User, MapPin
} from 'lucide-react';
import { Trialist } from '@/features/academy/types';
import { ErrorAlert } from '@/shared/components/Alerts';


/**
 * Page: Trialist Detail
 * Description: Detailed view of a potential recruit, including scout notes and attachments.
 * Requirements: REQ-ACA-01 (Trialist Management), REQ-SCT-01 (Scouting Reports)
 * User Story: US-ACA-005 (View Trialist)
 * User Journey: UJ-ACA-001 (Recruitment)
 * API: GET /academy/trialists/:id (API_ROUTES.TRIALISTS.VIEW)
 * Hook: useGet(API_ROUTES.TRIALISTS.VIEW)
 */
export default function TrialistDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const {
    data: trialist,
    loading,
    error,
  } = useGet<Trialist>(API_ROUTES.TRIALISTS.VIEW(Number(id)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INVITED': return 'bg-green-100 text-green-800 border-green-200';
      case 'ATTENDED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'NO_SHOW': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ACCEPTED': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFootLabel = (foot: string) => {
    switch (foot) {
      case 'LEFT': return 'Left Footed';
      case 'RIGHT': return 'Right Footed';
      case 'BOTH': return 'Both Feet';
      default: return foot;
    }
  };

  const calculateAge = (dob: Date | string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-emerald-700 text-lg font-medium">
          Loading trialist details...
        </div>
      </div>
    );
  }

  if (!trialist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-emerald-700 text-lg font-medium">Trialist not found</div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/dashboard/admin/academy/trialist"
            className="text-emerald-600 hover:text-emerald-800 flex items-center text-sm sm:text-base"
            data-testid="btn-back-trialist"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to trialists
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="trialist-name">
                      {trialist.firstName} {trialist.lastName}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(trialist.status)}" data-testid="trialist-status">
                        {trialist.status}
                      </span>
                      <span className="text-emerald-600 font-medium" data-testid="trialist-position">{trialist.position}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href={`/dashboard/admin/academy/trialist/${trialist.id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  data-testid="btn-edit-trialist"
                >
                  Edit Trialist
                </Link>
                {/* BRD Requirement: DEV-11 Promotion Gate */}
                {trialist.status === 'ACCEPTED' && (
                  <button
                    onClick={() => alert('Promote to Player flow initiated. Requires Academy Head approval per BR-TP-09.')}
                    className="ml-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    data-testid="btn-promote-player"
                  >
                    <User className="w-4 h-4" />
                    Promote to Player
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900" data-testid="trialist-email">{trialist.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900" data-testid="trialist-phone">{trialist.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Physical Attributes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900" data-testid="trialist-dob">
                        {trialist.dob ? new Date(trialist.dob).toLocaleDateString() : 'N/A'}
                        {trialist.dob && ` (${calculateAge(trialist.dob)} years)`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900" data-testid="trialist-height">{trialist.height ? `${trialist.height} cm` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Weight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900" data-testid="trialist-weight">{trialist.weight ? `${trialist.weight} kg` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Footprints className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900" data-testid="trialist-foot">{getFootLabel(trialist.preferredFoot)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Experience */}
            {trialist.previousClub && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Previous Experience
                </h2>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900" data-testid="trialist-club">{trialist.previousClub}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            {trialist.notes && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Scout Notes</h2>
                <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg" data-testid="section-notes">
                  {trialist.notes}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Media & Meta */}
          <div className="space-y-6">
            {/* Attachments */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Attachments</h2>
              <div className="space-y-3">
                {trialist.videoUrl && (
                  <a
                    href={trialist.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Video className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">Highlight Reel</div>
                      <div className="text-sm text-gray-500">Watch video</div>
                    </div>
                  </a>
                )}
                {trialist.cvUrl && (
                  <a
                    href={trialist.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">Resume/CV</div>
                      <div className="text-sm text-gray-500">View document</div>
                    </div>
                  </a>
                )}
                {!trialist.videoUrl && !trialist.cvUrl && (
                  <div className="text-gray-500 italic">No attachments available</div>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="text-gray-900">
                      {trialist.createdAt ? new Date(trialist.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="text-gray-900">
                      {trialist.updatedAt ? new Date(trialist.updatedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}