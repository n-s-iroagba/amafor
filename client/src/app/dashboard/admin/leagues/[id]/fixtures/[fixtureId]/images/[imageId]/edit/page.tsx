'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';
import { ErrorAlert } from '@/shared/components/Alerts';
import { LoadingSpinner } from '@/shared/components/LoadingStates';

interface MatchImage {
    id: number;
    fixtureId: number;
    imageUrl: string;
    caption?: string;
    createdAt: string;
}

/**
 * Page: Edit Fixture Image
 * Description: Form to update image metadata (caption).
 * Requirements: REQ-ADM-08 (Fixture Images)
 * User Story: US-ADM-008 (Manage Fixture Images)
 * User Journey: UJ-ADM-002 (Manage Fixtures)
 * API: PUT /match-gallery/:id (API_ROUTES.MATCH_GALLERY.MUTATE)
 */
export default function EditImagePage() {
    const router = useRouter();
    const params = useParams();
    const imageId = params.imageId as string;
    // const fixtureId = params.fixtureId as string; // Not strictly needed for the update, but maybe for navigation

    const [caption, setCaption] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    // Fetch existing data
    const { data: image, loading: isLoading, error: fetchError } = useGet<MatchImage>(
        API_ROUTES.MATCH_GALLERY.MUTATE(imageId)
    );

    // Update hook
    const { put, isPending: isSaving, error: saveError } = usePut(
        API_ROUTES.MATCH_GALLERY.MUTATE(imageId)
    );

    useEffect(() => {
        if (image) {
            setCaption(image.caption || '');
            setPreviewUrl(image.imageUrl);
        }
    }, [image]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await put({ caption });
            // Navigate back on success
            router.back();
        } catch (err) {
            console.error('Failed to update image:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    if (fetchError && !image) {
        return (
            <div className="p-6">
                <ErrorAlert message={fetchError} />
                <button
                    onClick={() => router.back()}
                    className="mt-4 flex items-center text-sky-600 hover:text-sky-800"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Gallery
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Gallery
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Image Details</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        {saveError && <div className="mb-6"><ErrorAlert message={saveError} /></div>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Preview */}
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                {previewUrl ? (
                                    <div className="relative w-full max-w-md h-64 sm:h-80">
                                        <Image
                                            src={previewUrl}
                                            alt="Fixture image preview"
                                            fill
                                            className="object-contain rounded-lg"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No image available</p>
                                )}
                            </div>

                            {/* Caption Input */}
                            <div>
                                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                                    Caption
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="caption"
                                        name="caption"
                                        rows={3}
                                        className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                                        placeholder="Enter a description for this image..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    This caption will be displayed in the gallery viewer.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
