'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Loader2,
    Plus,
    Trash2,
} from 'lucide-react';
import { API_ROUTES } from '@/config/routes';
import { usePost } from '@/shared/hooks/useApiQuery';
import { PatronTier, SubscriptionFrequency } from '@/features/patron/types';

export default function NewSubscriptionPackagePage() {
    const router = useRouter();
    const { post, isPending } = usePost(API_ROUTES.PATRONS.PACKAGES_MGMT.CREATE);

    const [formData, setFormData] = useState({
        tier: PatronTier.SUPPORTER,
        frequency: SubscriptionFrequency.MONTHLY,
        miniumumAmount: 0,
        benefits: [''] as string[],
    });

    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData({ ...formData, benefits: newBenefits });
    };

    const addBenefit = () => {
        setFormData({ ...formData, benefits: [...formData.benefits, ''] });
    };

    const removeBenefit = (index: number) => {
        const newBenefits = formData.benefits.filter((_, i) => i !== index);
        setFormData({ ...formData, benefits: newBenefits });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Filter out empty benefits
            const cleanData = {
                ...formData,
                benefits: formData.benefits.filter(b => b.trim() !== '')
            };

            await post(cleanData);
            router.push('/dashboard/admin/subscriptions');
            router.refresh();
        } catch (error) {
            console.error('Failed to create package:', error);
            alert('Failed to create package. Please check your input.');
        }
    };

    return (
        <div className="app-container max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/admin/subscriptions"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">New Subscription Package</h1>
                    <p className="text-gray-600">Define a new tier and its benefits</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Tier Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Patron Tier
                            </label>
                            <select
                                value={formData.tier}
                                onChange={(e) => setFormData({ ...formData, tier: e.target.value as PatronTier })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                data-testid="select-subscription-tier"
                            >
                                {Object.values(PatronTier).map((tier) => (
                                    <option key={tier} value={tier} className="capitalize">
                                        {tier.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Frequency Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frequency
                            </label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as SubscriptionFrequency })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                data-testid="select-subscription-frequency"
                            >
                                {Object.values(SubscriptionFrequency).map((freq) => (
                                    <option key={freq} value={freq} className="capitalize">
                                        {freq}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Amount */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Amount (NGN)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={formData.miniumumAmount}
                                    onChange={(e) => setFormData({ ...formData, miniumumAmount: Number(e.target.value) })}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="0.00"
                                    required
                                    data-testid="input-subscription-amount"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                The base price for this subscription tier. Users can choose to pay more.
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Package Benefits
                            </label>
                            <button
                                type="button"
                                onClick={addBenefit}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                data-testid="btn-add-benefit"
                            >
                                <Plus className="w-4 h-4" />
                                Add Benefit
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                                        placeholder="e.g. Access to exclusive content"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        data-testid={`input-benefit-${index}`}
                                    />
                                    {formData.benefits.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBenefit(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            data-testid={`btn-remove-benefit-${index}`}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/dashboard/admin/subscriptions"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        data-testid="btn-save-subscription"
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>Create Package</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
