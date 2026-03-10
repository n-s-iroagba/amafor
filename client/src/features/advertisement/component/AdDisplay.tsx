'use client';

import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdServe } from '../hooks/useAdServe';
import { AdZoneType } from '../types';

interface AdDisplayProps {
  /** The AdZone identifier string (e.g. 'TP_BAN', 'SIDEBAR', 'MID_ART') */
  identifier: string;
  /** Contextual targeting tags */
  tags?: string[];
  className?: string;
  showLabel?: boolean;
}

// -----------------------------------------------------------------
// Zone-type → layout helpers
// -----------------------------------------------------------------

/** Returns Tailwind classes that position/size the ad wrapper per zone type */
function getZoneLayoutClasses(zoneType: AdZoneType | undefined): string {
  switch (zoneType) {
    case AdZoneType.BANNER:
      // Full-width horizontal strip at the top/bottom of a section
      return 'w-full flex flex-col items-center my-4';
    case AdZoneType.SIDEBAR:
      // Fixed-width vertical unit that lives in a sidebar column
      return 'w-full max-w-[320px] flex flex-col mx-auto my-4';
    case AdZoneType.INTERSTITIAL:
      // Centred overlay-style unit with a constrained max width
      return 'w-full max-w-[640px] flex flex-col items-center mx-auto my-8';
    case AdZoneType.NATIVE:
    default:
      // Inline content-matched unit – blends with article flow
      return 'w-full flex flex-col my-4';
  }
}

/** Returns the pixel dimensions [width, height] from the zone dimensions string (e.g. "728x90") */
function parseDimensions(
  dimensionsStr: string | undefined,
  zoneType: AdZoneType | undefined
): [number | string, number] {
  // Banner-type ads stretch to 100% width; only height matters
  if (zoneType === AdZoneType.BANNER || zoneType === AdZoneType.NATIVE) {
    if (dimensionsStr) {
      const [, h] = dimensionsStr.split('x').map(Number);
      return ['100%', h || 90];
    }
    return ['100%', 90];
  }

  if (dimensionsStr) {
    const [w, h] = dimensionsStr.split('x').map(Number);
    if (w && h) return [w, h];
  }

  // Sensible defaults per zone type
  switch (zoneType) {
    case AdZoneType.SIDEBAR:
      return [300, 250];
    case AdZoneType.INTERSTITIAL:
      return [640, 360];
    default:
      return [300, 250];
  }
}

// -----------------------------------------------------------------
// Component
// -----------------------------------------------------------------

const AdDisplay: React.FC<AdDisplayProps> = ({
  identifier,
  tags = [],
  className = '',
  showLabel = true,
}) => {
  const { adData, loading, isError } = useAdServe(identifier, tags);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  // ── Guard rail: render nothing when …
  //    • there was a network/API error
  //    • the user dismissed the ad
  //    • loading finished but the server returned no ad for this zone
  if (isError || !isVisible) return null;
  if (!loading && !adData) return null;

  const zoneType = adData?.zone?.type as AdZoneType | undefined;
  const [width, height] = parseDimensions(adData?.zone?.dimensions, zoneType);
  const layoutClasses = getZoneLayoutClasses(zoneType);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, height: 0 }}
          className={`${layoutClasses} ${className}`}
        >
          {showLabel && (
            <div
              className="flex justify-between items-center text-[10px] text-gray-400 mb-1 px-1 uppercase tracking-wider font-medium w-full"
              style={{ maxWidth: typeof width === 'number' ? width : undefined }}
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
            // Skeleton — matches the zone's expected dimensions
            <div
              className="bg-gray-100 animate-pulse rounded-lg border border-gray-200"
              style={{
                width: typeof width === 'number' ? width : '100%',
                height,
              }}
            />
          ) : adData ? (
            // Ad creative
            <a
              href={adData.creative.destinationUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="relative group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50 border border-gray-100"
              style={{
                width: typeof width === 'number' ? width : '100%',
                height,
              }}
            >
              {adData.creative.type === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source
                    src={adData.creative.url}
                    type={`video/${adData.creative.format}`}
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={adData.creative.url}
                  alt={adData.creative.name || 'Advertisement'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity duration-300" />
              </div>
            </a>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdDisplay;