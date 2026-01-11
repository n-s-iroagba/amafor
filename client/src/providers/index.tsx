import { ObservabilityProvider } from './observability-provider';
import { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ObservabilityProvider>
      {/* Other providers */}
      {children}
    </ObservabilityProvider>
  );
}