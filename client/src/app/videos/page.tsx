'use client';

import React, { useState } from 'react';
/**
 * Public Video Archives
 * 
 * Central registry for all club multimedia content, including match highlights, 
 * interviews, and behind-the-scenes footage.
 * 
 * @screen SC-144
 * @implements REQ-PUB-02
 * @usecase UC-PUB-02 (Browse Video Archives)
 * @requires SRS-I-140 (Videos API - GET /videos)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-140 Monitor multimedia engagement and video play rates
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Video as VideoIcon } from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';
import { PaginatedData } from '@/shared/types';
import { Video } from '@/features/videos/types';
import VideoCard from '@/features/videos/components/VideoCard';
import VideoSkeleton from '@/features/videos/components/VideoSkeleton';
import { Footer } from '@/shared/components/Footer';
import { WhatsAppWidget } from '@/shared/components/WhatsAppWidget';
import AdDisplay from '@/features/advertisement/component/AdDisplay';
import { Header } from '@/shared/components/Header';

const VideoArchivePage = () => {
    const [page, setPage] = useState(1);
    const limit = 9;

    const { data, loading, error } = useGet<PaginatedData<Video>>(
        API_ROUTES.VIDEOS.LIST,
        {
            params: { page, limit }
        }
    );

    const videos = data?.data;
    const totalPages = data?.totalPages || 1;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-sky-950 text-white flex flex-col">
                <main className="flex-grow">
                    {/* Hero Header */}
                    <section className="relative py-20 overflow-hidden border-b border-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15)_0%,transparent_50%)]"></div>
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-bold mb-6">
                                    <VideoIcon className="w-4 h-4" />
                                    MULTIMEDIA HUB
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 tracking-tight">
                                    Video <span className="text-sky-500">Archives</span>
                                </h1>
                                <p className="text-xl text-sky-200/60 max-w-2xl mx-auto font-light leading-relaxed">
                                    Explore our collection of exclusive interviews, match highlights,
                                    and behind-the-scenes access to Amafor Gladiators.
                                </p>
                            </motion.div>
                        </div>
                    </section>

                    {/* Content Grid */}
                    <section className="py-16 sm:py-24 w-full max-w-7xl mx-auto px-4 sm:px-6">
                        {/* Top banner ad — sits between hero and the video grid */}
                        <AdDisplay identifier="TP_BAN" className="mb-12" />
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-center px-4 py-4 rounded-xl mb-12">
                                Error loading videos: {error}
                            </div>
                        )}

                        {!loading && !videos?.length && (
                            <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10">
                                <Play className="w-16 h-16 mx-auto text-sky-500/30 mb-6" />
                                <h2 className="text-2xl font-bold mb-2">No Videos Found</h2>
                                <p className="text-sky-200/40">Our multimedia team is currently uploading new content. Check back soon!</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <VideoSkeleton key={i} />
                                ))
                            ) : (
                                <AnimatePresence mode='popLayout'>
                                    {videos?.map((video, index) => (
                                        <VideoCard
                                            key={video.id}
                                            video={video}
                                            index={index}
                                        />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex justify-center gap-3">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-12 h-12 rounded-xl font-bold transition-all border ${page === i + 1
                                            ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20 scale-110'
                                            : 'bg-white/5 border-white/10 text-sky-200 hover:bg-white/10'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Native/inline ad — between pagination and footer */}
                        <AdDisplay identifier="MID_ART" className="mt-16" />
                    </section>
                </main>

                <Footer />
                <WhatsAppWidget />
            </div>
        </>
    );
};

export default VideoArchivePage;
