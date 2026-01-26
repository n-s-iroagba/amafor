'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Edit,
    Plus,
    Trash2,
    Loader2,
    Search,
    Users,
    CreditCard,
    Check,
} from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { useGet, useDelete } from '@/shared/hooks/useApiQuery';
// Import the updated type - we need to make sure we are importing the right one.
// Assuming we exported SubscriptionPackage from index.ts or define it locally if import fails.
import { PatronSubscriptionPackage } from '@/features/patron/types';

// Fallback if import fails or is not updated yet in build context
interface SubscriptionPkg extends PatronSubscriptionPackage { }

export default function SubscriptionPackagesPage() {
    const { data, loading, error, refetch } = useGet<{ data: SubscriptionPkg[] }>(
        API_ROUTES.PATRONS.PACKAGES
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const { delete: deletePackage } = useDelete(
        API_ROUTES.PATRONS.PACKAGES_MGMT.DELETE
    );

    const packages = data?.data || [];

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deletePackage(id);
            await refetch();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting package. Please try again.');
        } finally {
            setDeletingId(null);
            setShowDeleteConfirm(null);
        }
    };

    const confirmDelete = (id: string) => {
        setShowDeleteConfirm(id);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    // Filter packages based on tier
    const filteredPackages = packages?.filter((pkg) =>
        pkg.tier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="app-container flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-container">
                <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Failed to Load Packages
                    </h2>
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
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Subscription Packages</h1>
                        <p className="text-gray-600">Manage subscription tiers and benefits</p>
                    </div>
                </div>

                <Link
                    href="/dashboard/admin/subscriptions/new"
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Create Package
                </Link>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by tier name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No packages found</h3>
                        <Link
                            href="/dashboard/admin/subscriptions/new"
                            className="inline-flex items-center gap-2 text-purple-600 hover:underline mt-2"
                        >
                            Create your first package
                        </Link>
                    </div>
                ) : (
                    filteredPackages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium uppercase tracking-wider mb-2">
                                            {pkg.frequency}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                                            {pkg.tier.replace(/_/g, ' ')}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(pkg.miniumumAmount)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Benefits</p>
                                    <ul className="space-y-2">
                                        {pkg.benefits?.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                        {(!pkg.benefits || pkg.benefits.length === 0) && (
                                            <li className="text-sm text-gray-400 italic">No benefits listed</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t rounded-b-xl flex justify-end gap-2">
                                <Link
                                    href={`/dashboard/admin/subscriptions/${pkg.id}/edit`}
                                    className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-200"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span className="text-sm font-medium">Edit</span>
                                </Link>

                                {showDeleteConfirm === pkg.id ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            disabled={deletingId === pkg.id}
                                            className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            {deletingId === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                                        </button>
                                        <button
                                            onClick={cancelDelete}
                                            className="text-gray-500 hover:text-gray-700 px-2 py-2 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => confirmDelete(pkg.id)}
                                        className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Delete</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
