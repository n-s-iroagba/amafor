import { useObservability } from '@/shared/lib/observability/hooks/useObservability';
import { ReactNode, useEffect } from 'react';


export function ObservabilityProvider({ children }: { children: ReactNode }) {
  const observability = useObservability();

  useEffect(() => {
    // Initialize on app start
    observability.initialize();
    
    // Track initial page view
    observability.trackPageView('initial_load');
  }, []);

  return children;
}