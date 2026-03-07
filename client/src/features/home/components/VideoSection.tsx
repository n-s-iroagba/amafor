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
  const { data: videos } = useGet<Video[]>(
    API_ROUTES.VIDEOS.LIST, {
    params: {
      limit: 3
    }
  }
  );



  // Fallback thumbnail or placeholder
  const getThumbnailUrl = (video: Video) => {
    if (video.thumbnail) {
      return video.thumbnail;
    }
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop&auto=format';
  };

  // Don't render section if no videos
  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-24 bg-sky-950 text-white relative overflow-hidden">
      {/* Subtle Glow overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(56,189,248,0.1)_0%,transparent_50%)]"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            <span className="text-white">
              Exclusive Content
            </span>
          </h2>
          <p className="text-xl text-sky-100/70 max-w-2xl mx-auto font-light leading-relaxed">
            Immerse yourself in premium behind-the-scenes footage and exclusive
            interviews
          </p>
        </div>

        {/* Video Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-sky-800 to-sky-900">
                <div className="mb-3 p-4 pb-0">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${index % 3 === 0
                      ? 'bg-sky-500/80'
                      : index % 3 === 1
                        ? 'bg-cyan-500/80'
                        : 'bg-blue-500/80'
                      }`}
                  >
                    {video.excerpt}
                  </span>
                </div>
                <div className="relative h-80 w-full bg-sky-700 overflow-hidden">
                  <Image
                    height={100}
                    width={100}
                    unoptimized
                    src={getThumbnailUrl(video)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
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
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-sky-950/90 to-transparent">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-sky-300 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-sky-200/90">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-sky-400" />
                      {video.duration || 'N/A'}m
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-sky-400" />
                      {Math.floor(Math.random() * 5) + 1}M
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button - Only show if there are videos */}
        {videos.length > 0 && (
          <div className="flex justify-center">
            <button className="px-10 py-4 bg-white text-sky-900 hover:bg-sky-50 transition-all font-bold rounded-lg shadow-xl hover:scale-105 active:scale-95">
              VIEW ALL ARCHIVES
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSection;