import { useGet } from '@/shared/hooks/useApiQuery';
import { useMemo } from 'react';


// --- Types ---
export interface AdZone {
  id: string;
  name: string;
  dimensions: string;
  maxSize: string;
}

export interface AdCreative {
  id: string;
  name: string;
  url: string;
  destinationUrl: string;
  type: 'image' | 'video';
  format: string;
  dimensions: { width: number; height: number };
}

export interface AdResponse {
  creative: AdCreative;
  zone: AdZone;
  trackingId?: string;
}

export const useAdServe = (identifier: string, tags: string[] = []) => {
  // Memoize the URL generation to prevent unnecessary re-renders
  const resourceUrl = useMemo(() => {
    if (!identifier) return null;

    const queryParams = new URLSearchParams();
    if (tags && tags.length > 0) {
      queryParams.append('tags', tags.join(','));
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    // Adjust base path if needed, e.g., '/ads/serve'
    return `/ads/serve/${identifier}${queryString}`;
  }, [identifier, tags]);

  // Use your custom useGet hook
  const { data, loading, error, isError } = useGet<AdResponse>(resourceUrl, {
    enabled: !!identifier,
    refetchOnWindowFocus: false, // Ads usually don't need to refresh on focus
    staleTime: 10 * 60 * 1000, // Keep ad cached for 10 mins
  });

  return {
    adData: data,
    loading,
    error,
    isError,
    // Helper to parse dimensions string "300x250" -> [300, 250]
    getDimensions: () => {
      if (!data?.zone?.dimensions) return [300, 250];
      return data.zone.dimensions.split('x').map(Number);
    }
  };
};