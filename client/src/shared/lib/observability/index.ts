// src/lib/observability/index.ts
import { createObservabilityConfig } from './config';
import { logger } from './logger';
import { metrics } from './metrics';
import { tracer } from './tracer';
import type { BusinessMetric, LogEntry, LogLevel, ObservabilityConfig, PerformanceMetric, TraceSpan } from './types';

// Re-export types
export type { ObservabilityConfig, LogLevel, LogEntry, PerformanceMetric, BusinessMetric, TraceSpan };

// Main observability service
export class ObservabilityService {
  private config = createObservabilityConfig();
  
  constructor(config?: Partial<ObservabilityConfig>) {
    if (config) {
      this.config = createObservabilityConfig(config);
      this.applyConfig();
    }
  }
  
  private applyConfig(): void {
    logger.setConfig(this.config.logging);
    metrics.setConfig(this.config.metrics);
    tracer.setConfig(this.config.tracing);
  }
  
  // Initialize
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      // Initialize country detection
      await this.detectCountry();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Track initial page view
      this.trackPageView();
      
      // Setup route change tracking
      this.setupRouteTracking();
      
      logger.info('Observability initialized');
    } catch (error) {
      logger.error('Failed to initialize observability', error as Error);
    }
  }
  
  // Country Detection
  private async detectCountry(): Promise<void> {
    try {
      const country = await this.getCountryFromIP();
      if (country && country !== 'XX') {
        localStorage.setItem('user_country', country);
        localStorage.setItem('country_source', 'ip');
        metrics.recordCountryVisit(country);
      }
    } catch (error) {
      // Fallback to browser locale
      const browserCountry = this.getCountryFromBrowser();
      if (browserCountry) {
        localStorage.setItem('user_country', browserCountry);
        localStorage.setItem('country_source', 'browser');
      }
    }
  }
  
  private async getCountryFromIP(): Promise<string> {
    try {
      const response = await fetch('/api/geolocation/country');
      const data = await response.json();
      return data.country || 'XX';
    } catch {
      return 'XX';
    }
  }
  
  private getCountryFromBrowser(): string | null {
    try {
      const lang = navigator.language || navigator.languages[0];
      if (lang && lang.includes('-')) {
        return lang.split('-')[1].toUpperCase();
      }
    } catch {
      // Ignore
    }
    return null;
  }
  
  // Performance Monitoring
  private setupPerformanceMonitoring(): void {
    // Already handled by MetricsCollector
  }
  
  // Page Tracking
  trackPageView(): void {
    const page = window.location.pathname;
    logger.info(`Page view: ${page}`);
    tracer.tracePageLoad(page);
    
    // Record as business metric
    metrics.recordRegistration('fan'); // Page view counts as fan engagement
  }
  
  private setupRouteTracking(): void {
    if (typeof window === 'undefined') return;
    
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setTimeout(() => {
        const page = window.location.pathname;
        logger.info(`Route changed: ${page}`);
        tracer.tracePageLoad(page);
      }, 100);
    };
  }
  
  // Ad View Tracking (SRS requirement)
  trackAdView(adId: string, zone: string): void {
    const isUnique = this.isUniqueAdView(adId);
    metrics.recordAdView(adId, zone, isUnique);
    logger.info(`Ad view: ${adId}`, { zone, isUnique });
  }
  
  private isUniqueAdView(adId: string): boolean {
    const key = `ad_view_${adId}`;
    const lastView = localStorage.getItem(key);
    
    if (!lastView) {
      localStorage.setItem(key, Date.now().toString());
      return true;
    }
    
    const lastViewTime = parseInt(lastView, 10);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (Date.now() - lastViewTime > twentyFourHours) {
      localStorage.setItem(key, Date.now().toString());
      return true;
    }
    
    return false;
  }
  
  // Donation Tracking (SRS requirement)
  trackDonation(amount: number, transactionId: string, isRecurring = false): void {
    metrics.recordDonation(amount, transactionId, isRecurring);
    logger.info(`Donation processed: ${transactionId}`, { amount, isRecurring });
  }
  
  // Error Tracking
  trackError(error: Error, type: 'js' | 'api' | 'validation' = 'js'): void {
    logger.error(error.message, error);
    metrics.recordError(`${type}_errors`);
  }
  
  // API Call Wrapper
  async traceApiCall<T>(
    apiCall: Promise<T>,
    endpoint: string,
    method: string
  ): Promise<T> {
    return tracer.traceApiCall(apiCall, endpoint, method);
  }
  
  // Get Dashboard Data
  getDashboardData() {
    return {
      logs: logger.getLogs(),
      performance: metrics.getPerformanceMetrics(),
      business: metrics.getBusinessMetrics(),
      countries: metrics.getCountryStats(),
      spans: tracer.getSpans(),
      config: this.config
    };
  }
  
  // Update Configuration
  updateConfig(config: Partial<ObservabilityConfig>): void {
    this.config = createObservabilityConfig(config);
    this.applyConfig();
  }
  
  // Clear All Data
  clearAll(): void {
    logger.clearLogs();
    metrics.clearMetrics();
    tracer.clearSpans();
  }
}

// Singleton instance
export const observability = new ObservabilityService();

// Convenience exports
export { logger, metrics, tracer };