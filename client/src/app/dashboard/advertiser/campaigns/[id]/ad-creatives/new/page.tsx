'use client';
import React, { useState } from 'react';
import { ArrowLeft, UploadCloud, Loader2, X, FileImage, FileVideo } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

/**
 * @requirements REQ-ADV-02, REQ-ADV-07
 */


/**
 * Page: Upload Ad Creative
 * Description: Form to upload a new ad image or video.
 * Requirements: REQ-ADV-08 (Creative Management)
 * User Story: US-ADV-008 (Manage Ad Creatives)
 * User Journey: UJ-ADV-002 (Manage Ad Campaigns)
 * API: POST /ads/creatives (API_ROUTES.ADS.CREATIVES.CREATE)
 */
export default function NewCreativePage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;

    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { post, isPending, error } = usePost(API_ROUTES.ADS.CREATIVES.CREATE, {
        onSuccess: () => {
            router.push(`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives`);
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name) return;

        const formData = new FormData();
        formData.append('campaignId', campaignId);
        formData.append('name', name);
        formData.append('file', file);
        formData.append('type', file.type.startsWith('image') ? 'image' : 'video');

        // Note: usePost normally expects JSON. If our hook processes objects to JSON, 
        // we might need to adjust or ensure our Api/Axios config handles FormData automatically 
        // when passed as payload. Usually axios handles it if the data is FormData.
        await post(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href={`/dashboard/advertiser/campaigns/${campaignId}/ad-creatives`} className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3 mr-2" /> Back to Creatives
                </Link>

                <h1 className="text-3xl text-[#2F4F4F] mb-8 uppercase tracking-tight font-black">Upload Creative</h1>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Creative Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Summer Promo Banner A"
                                className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-[#2F4F4F] placeholder-gray-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Media File</label>

                            {!file ? (
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer relative"
                                >
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*,video/*"
                                    />
                                    <div className="w-16 h-16 bg-[#87CEEB]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#87CEEB]">
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-[#2F4F4F] mb-2">Click or drag file to upload</h3>
                                    <p className="text-xs text-gray-400">Supports JPG, PNG, GIF, MP4 (Max 100MB)</p>
                                </div>
                            ) : (
                                <div className="relative rounded-3xl overflow-hidden border border-gray-100 bg-gray-50">
                                    {file.type.startsWith('image') ? (
                                        <img src={previewUrl!} alt="Preview" className="w-full h-64 object-contain" />
                                    ) : (
                                        <video src={previewUrl!} controls className="w-full h-64 object-contain" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-3 rounded-xl flex items-center shadow-sm">
                                        {file.type.startsWith('image') ? <FileImage className="w-4 h-4 mr-3 text-[#87CEEB]" /> : <FileVideo className="w-4 h-4 mr-3 text-[#87CEEB]" />}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-[#2F4F4F] truncate">{file.name}</div>
                                            <div className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center">
                                <span className="mr-2">⚠️</span> {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!file || !name || isPending}
                                className="w-full py-4 rounded-2xl bg-[#2F4F4F] text-white font-black uppercase tracking-widest hover:bg-[#1a2f2f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>{isPending ? 'Uploading...' : 'Upload Creative'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
