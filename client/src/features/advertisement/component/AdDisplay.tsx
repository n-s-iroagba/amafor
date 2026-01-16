'use client';

import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdServe } from '../hooks/useAdServe'; // Adjust path

interface AdDisplayProps {
  identifier: string; // The AdZone ID (e.g., 'TP_BAN')
  tags?: string[];    // Contextual tags
  className?: string;
  showLabel?: boolean;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ 
  identifier, 
  tags = [], 
  className = '',
  showLabel = true 
}) => {
  // 1. Logic extracted to custom hook
  const { adData, loading, isError, getDimensions } = useAdServe(identifier, tags);
  
  // 2. Local UI state (visibility)
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  // Hide component if error, manually closed, or loaded but no data returned
  if (isError || !isVisible || (!loading && !adData)) {
    return null;
  }

  const [width, height] = getDimensions();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, height: 0 }}
          className={`relative flex flex-col items-center justify-center my-6 ${className}`}
        >
          {showLabel && (
            <div 
              className="flex justify-between items-center text-[10px] text-gray-400 mb-1 px-1 uppercase tracking-wider font-medium w-full"
              style={{ maxWidth: width }}
            >
              <span>Advertisement</span>
              <button 
                onClick={handleClose}
                className="hover:text-gray-600 transition-colors"
                aria-label="Close ad"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {loading ? (
            // Skeleton State
            <div 
              className="bg-gray-100 animate-pulse rounded-lg border border-gray-200"
              style={{ width: '100%', maxWidth: width, height: height }}
            />
          ) : (
            // Ad Content
            <a
              href={adData?.creative.destinationUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="relative group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50 border border-gray-100"
              style={{ width: '100%', maxWidth: width, height: height }}
            >
              {adData?.creative.type === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={adData.creative.url} type={`video/${adData.creative.format}`} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={adData?.creative.url}
                  alt={adData?.creative.name || 'Ad'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity duration-300" />
              </div>
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdDisplay;