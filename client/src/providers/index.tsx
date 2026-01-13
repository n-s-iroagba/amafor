import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth-provider';
import { ObservabilityProvider } from './observability-provider';
import { ReactNode, useState } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
    <ObservabilityProvider>
     <AuthProvider>
      {children}
      </AuthProvider>
    </ObservabilityProvider>
    </QueryClientProvider>
  );
}