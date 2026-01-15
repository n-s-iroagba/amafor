'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Clock, Users, Play } from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';

export interface Video {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  videoUrl: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const VideoSection = () => {
  // Mock data for demo
  const { data:data } = useGet<{data:Video[]}>(
    `${API_ROUTES.VIDEOS.LIST}?page=1?limit=5`
  );
  const videos = data?.data

  // Fallback thumbnail or placeholder
  const getThumbnailUrl = (video: Video) => {
    if (video.thumbnail) {
      return video.thumbnail;
    }
    // Return a consistent placeholder image
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop&auto=format';
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 text-white relative overflow-hidden">
      {/* Glow overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.3)_0%,transparent_50%)] opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.3)_0%,transparent_50%)] opacity-70"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200 bg-clip-text text-transparent">
              Exclusive Content
            </span>
          </h2>
          <p className="text-xl text-sky-200 max-w-2xl mx-auto font-light">
            Immerse yourself in premium behind-the-scenes footage and exclusive
            interviews
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {videos?.length && (
            videos.map((video, index) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
                   <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                          index % 3 === 0
                            ? 'bg-sky-500/80'
                            : index % 3 === 1
                              ? 'bg-cyan-500/80'
                              : 'bg-blue-500/80'
                        }`}
                      >
                        {video.excerpt}
                      </span>
                    </div>
                  <div className="relative h-80 w-full bg-slate-700 overflow-hidden">
                    <Image
                      height={100}
                      width={100}
                      unoptimized
                      src={getThumbnailUrl(video)}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop&auto=format';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-sky-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a target='_blank' href={video.videoUrl}>
                      <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-125 transition-transform duration-300">
                        <Play
                          className="w-7 h-7 text-white ml-1"
                          fill="white"
                        />
                      </div>
                      </a>
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                  
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-sky-200 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-sky-200">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {video.duration || 'N/A'}m
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {Math.floor(Math.random() * 5) + 1}M
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) }
             <div className="flex justify-center">
          <button className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-semibold">
            View More
          </button>
        </div>
        </div>

        {/* View More Button */}
     
      </div>
    </section>
  );
};

export default VideoSection;