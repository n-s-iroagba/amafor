// src/lib/observability/config.ts
import { ObservabilityConfig } from "./types";

export const createObservabilityConfig = (options?: Partial<ObservabilityConfig>): ObservabilityConfig => {
  const defaultConfig: ObservabilityConfig = {
    logging: {
      levels: ['error', 'warn', 'info', 'debug'] as const,
      sanitize: true,
      context: {
        sessionId: '',
        userId: undefined,
        pathname: '',
        userAgent: '',
        timestamp: '',
        country: undefined,
        countrySource: undefined
      }
    },
    metrics: {
      performance: ['LCP', 'FID', 'CLS', 'INP'],
      business: ['ad_views', 'donations', 'registrations'],
      errors: ['js_errors', 'api_errors', 'validation_errors'],
      countries: {
        active_users: true,
        conversion_rates: true,
        error_distribution: true
      }
    },
    tracing: {
      correlationId: '',
      spans: {
        apiCalls: true,
        userInteractions: true,
        pageLoad: true
      }
    }
  };

  return {
    ...defaultConfig,
    ...options
  } as const;
};

// Default configuration
export const defaultObservabilityConfig = createObservabilityConfig();