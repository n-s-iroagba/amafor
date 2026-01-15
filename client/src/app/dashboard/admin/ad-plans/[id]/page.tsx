// app/admin/ad-plans/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  DollarSign,
  Zap,
  Users,
  Calendar,
  Edit,
  ArrowLeft,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface AdPlan {
  id: number;
  name: string;
  description: string | null;
  maxImpressions: number | null;
  isActive: boolean;
  price: number;
  created_at: string;
  updated_at: string;
  _count?: {
    subscriptions: number;
  };
}

export default function AdPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const {
    data: plan,
    loading,
    error,
  } = useGet<AdPlan>(API_ROUTES.ADS.PLANS.DETAIL(planId));

  if (loading) {
    return (
      <div className="app-container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="app-container">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Ad Plan Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The ad plan you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push('/admin/ad-plans')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Ad Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/admin/ad-plans')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{plan.name}</h1>
          <p className="text-gray-600">Ad Plan Details</p>
        </div>
        <Link
          href={`/admin/ad-plans/${plan.id}/edit`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Plan
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Plan Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    plan.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {plan.isActive ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Price</span>
                <span className="font-bold text-green-600 text-xl">
                  ${parseFloat(plan.price.toString()).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Max Impressions</span>
                <span className="font-semibold text-gray-800">
                  {plan.maxImpressions
                    ? `${plan.maxImpressions.toLocaleString()} views`
                    : 'Unlimited'}
                </span>
              </div>

              {plan.description && (
                <div>
                  <span className="text-gray-600 block mb-2">Description</span>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {plan.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Usage Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {plan._count?.subscriptions || 0}
                </p>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {plan._count?.subscriptions
                    ? `$${(parseFloat(plan.price.toString()) * (plan._count.subscriptions || 0)).toFixed(2)}`
                    : '$0'}
                </p>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Details */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Plan Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Plan Type</p>
                  <p className="font-medium text-gray-800">{plan.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-800">
                    ${parseFloat(plan.price.toString()).toFixed(2)}/month
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Impressions</p>
                  <p className="font-medium text-gray-800">
                    {plan.maxImpressions
                      ? plan.maxImpressions.toLocaleString()
                      : 'Unlimited'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-800">
                    {new Date(plan.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-800">
                    {new Date(plan.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href={`/admin/ad-plans/${plan.id}/edit`}
                className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors justify-center"
              >
                <Edit className="w-4 h-4" />
                Edit Plan
              </Link>
              <button
                onClick={() => router.push('/admin/ad-plans')}
                className="w-full flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
