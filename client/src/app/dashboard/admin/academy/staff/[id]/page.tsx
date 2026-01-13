'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  Edit,
  Trash2,
  Download,
  Share2,

  Award,
  Briefcase,
  Calendar,
 
  Users,
  BookOpen,
  Shield,
  Star,
  Target,
  TrendingUp,
  FileText,
  ExternalLink,

  UserCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
import { AcademyStaff } from '@/features/academy/types';


export default function StaffDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch staff details
  const { 
    data: staff, 
    loading, 
    error 
  } = useGet<AcademyStaff>(`/api/academy/staff/${staffId}`, {
    params: {
      include: 'reports,achievements'
    }
  });



  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'coaching': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-green-100 text-green-800';
      case 'administrative': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-orange-100 text-orange-800';
      case 'scouting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'coaching': return <Award className="h-5 w-5" />;
      case 'medical': return <Shield className="h-5 w-5" />;
      case 'administrative': return <Briefcase className="h-5 w-5" />;
      case 'technical': return <Target className="h-5 w-5" />;
      case 'scouting': return <UserCheck className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-slate-700 animate-spin mb-4" />
            <p className="text-slate-600">Loading staff details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-8"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Staff
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              {error ? 'Error Loading Staff Details' : 'Staff Not Found'}
            </h3>
            <p className="text-red-600 mb-6">
              {error || 'The requested staff member could not be found.'}
            </p>
            <button
              onClick={() => router.push('/academy/staff')}
              className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors font-medium"
            >
              Browse All Staff
            </button>
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
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Staff
            </button>
            <div className="flex items-center gap-3">
              <Link
                href={`/academy/staff/${staffId}/edit`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600/90 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {staff.imageUrl ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                  <Image
                    src={staff.imageUrl}
                    alt={staff.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center text-white text-4xl font-bold border-4 border-white/20">
                  {staff.initials || staff.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Staff Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{staff.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getCategoryColor(staff.category)}`}>
                  {getCategoryIcon(staff.category)}
                  {staff.category || 'General'}
                </span>
              </div>
              
              <h2 className="text-xl text-slate-300 mb-4">{staff.role}</h2>
              
              <div className="flex flex-wrap items-center gap-4 text-slate-300">
                {staff.yearsOfExperience && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{staff.yearsOfExperience}+ years experience</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>Academy Staff</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bio & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-slate-600" />
                Biography
              </h3>
              <div className="prose max-w-none">
                <p className="text-slate-700 whitespace-pre-line">{staff.bio}</p>
              </div>
            </div>

            {/* Qualifications */}
            {staff.qualifications && staff.qualifications.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-slate-600" />
                  Qualifications & Certifications
                </h3>
                <div className="space-y-3">
                  {staff.qualifications.map((qualification, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <Award className="h-4 w-4 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{qualification}</h4>
                        <p className="text-sm text-slate-600 mt-1">Professional Certification</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Timeline */}
            {staff.yearsOfExperience && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-sky-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-slate-800">Total Experience</h4>
                      <p className="text-slate-600">Years in football and coaching</p>
                    </div>
                    <div className="text-3xl font-bold text-sky-700">{staff.yearsOfExperience} years</div>
                  </div>
                  
                  {/* Mock experience items */}
                  <div className="border-l-2 border-sky-500 ml-6 space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-sky-500 border-2 border-white"></div>
                      <h4 className="font-semibold text-slate-800">Current Role</h4>
                      <p className="text-slate-700">{staff.role}</p>
                      <p className="text-sm text-slate-600 mt-1">Amafor Gladiators FC Academy</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-sky-300 border-2 border-white"></div>
                      <h4 className="font-semibold text-slate-800">Previous Experience</h4>
                      <p className="text-slate-700">Senior Coach</p>
                      <p className="text-sm text-slate-600 mt-1">Various football academies</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Staff Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Specialization</div>
                      <div className="text-sm text-slate-600">{staff.category || 'General'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Experience</div>
                      <div className="text-sm text-slate-600">{staff.yearsOfExperience || 'N/A'} years</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Qualifications</div>
                      <div className="text-sm text-slate-600">{staff.qualifications?.length || 0} certifications</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/academy/staff/${staffId}/edit`}
                  className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Edit className="h-4 w-4" />
                  Edit Staff Details
                </Link>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Staff Member
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Related</h3>
              <div className="space-y-3">
                <Link
                  href="/academy"
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Academy Overview</div>
                      <div className="text-sm text-slate-600">View all academy sections</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
                
                <Link
                  href="/academy/staff"
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">All Staff</div>
                      <div className="text-sm text-slate-600">View all academy staff</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

 
    </div>
  );
}