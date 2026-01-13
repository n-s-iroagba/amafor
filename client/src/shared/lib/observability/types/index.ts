// src/lib/observability/types.ts
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type CountrySource = 'ip' | 'header' | 'browser' | 'fallback' | 'cache';

export interface LogContext {
  sessionId: string;
  userId?: string;
  pathname: string;
  userAgent: string;
  timestamp: string;
  country?: string;
  countrySource?: CountrySource;
}

export interface LoggingConfig {
  levels: readonly LogLevel[];
  sanitize: boolean;
  context: {
    sessionId: string;
    userId?: string;
    pathname: string;
    userAgent: string;
    timestamp: string;
    country?: string;
    countrySource?: CountrySource;
  };
}

export interface MetricsConfig {
  performance: string[];
  business: string[];
  errors: string[];
  countries: {
    active_users: boolean;
    conversion_rates: boolean;
    error_distribution: boolean;
  };
}

export interface TracingConfig {
  correlationId: string;
  spans: {
    apiCalls: boolean;
    userInteractions: boolean;
    pageLoad: boolean;
  };
}

export interface ObservabilityConfig {
  logging: LoggingConfig;
  metrics: MetricsConfig;
  tracing: TracingConfig;
}

// Data structures
export interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error;
  context: LogContext;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
}

export interface BusinessMetric {
  type: 'ad_view' | 'donation' | 'registration' | 'conversion';
  value: number;
  data: Record<string, any>;
  timestamp: string;
}

export interface TraceSpan {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  parentId?: string;
  tags?: Record<string, any>;
}

