import React from 'react';

const VideoSkeleton = () => {
    return (
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-sky-900 border border-sky-800/50 animate-pulse">
            <div className="mb-3 p-4 pb-0">
                <div className="w-16 h-5 bg-sky-800 rounded-full"></div>
            </div>
            <div className="relative h-64 w-full bg-sky-950"></div>
            <div className="p-6">
                <div className="h-6 bg-sky-800 rounded w-3/4 mb-3"></div>
                <div className="flex justify-between">
                    <div className="h-4 bg-sky-800 rounded w-1/4"></div>
                    <div className="h-4 bg-sky-800 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );
};

export default VideoSkeleton;
