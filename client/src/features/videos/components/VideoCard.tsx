'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Clock, Users, Play } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
    video: Video;
    index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
    const getThumbnailUrl = (video: Video) => {
        if (video.thumbnail) {
            return video.thumbnail;
        }
        return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop&auto=format';
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group cursor-pointer"
        >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-sky-900 border border-sky-800/50">
                <div className="mb-3 p-4 pb-0">
                    <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm text-white ${index % 3 === 0
                            ? 'bg-sky-500/80'
                            : index % 3 === 1
                                ? 'bg-cyan-500/80'
                                : 'bg-blue-500/80'
                            }`}
                    >
                        {video.excerpt || 'Exclusive'}
                    </span>
                </div>
                <div className="relative h-64 w-full bg-sky-950 overflow-hidden">
                    <Image
                        height={400}
                        width={600}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/40 to-transparent opacity-80"></div>
                    <div className="absolute inset-0 bg-sky-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <a target='_blank' href={video.videoUrl} onClick={(e) => e.stopPropagation()}>
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-sky-500 transition-all duration-300 transform group-hover:scale-110">
                                <Play
                                    className="w-7 h-7 text-white ml-1"
                                    fill="white"
                                />
                            </div>
                        </a>
                    </div>
                </div>

                {/* Info Content */}
                <div className="p-6 bg-sky-900/50 backdrop-blur-sm">
                    <h3 className="text-white font-bold text-lg mb-3 leading-tight group-hover:text-sky-300 transition-colors line-clamp-2">
                        {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-sky-200/80">
                        <span className="flex items-center bg-sky-950/50 px-3 py-1 rounded-full border border-sky-800/50">
                            <Clock className="w-4 h-4 mr-2 text-sky-400" />
                            {video.duration || 'N/A'}m
                        </span>
                        <span className="flex items-center text-sky-400 font-medium">
                            <Users className="w-4 h-4 mr-1.5" />
                            {Math.floor(Math.random() * 5) + 1}M Views
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoCard;
