import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play } from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';
import { PaginatedData } from '@/shared/types';
import { Video } from '@/features/videos/types';
import VideoCard from '@/features/videos/components/VideoCard';

const VideoSection = () => {
  const { data } = useGet<PaginatedData<Video>>(
    API_ROUTES.VIDEOS.LIST, {
    params: {
      limit: 3
    }
  }
  );

  const videos = data?.data;

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              <span className="text-white">
                Exclusive Content
              </span>
            </h2>
            <p className="text-xl text-sky-200/60 max-w-2xl mx-auto font-light leading-relaxed">
              Immerse yourself in premium behind-the-scenes footage and exclusive
              interviews
            </p>
          </motion.div>
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </motion.div>

        {/* View More Button */}
        <div className="flex justify-center">
          <Link
            href="/videos"
            className="px-10 py-4 bg-white text-sky-900 hover:bg-sky-50 transition-all font-black rounded-xl shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 group"
          >
            VIEW ALL ARCHIVES
            <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;