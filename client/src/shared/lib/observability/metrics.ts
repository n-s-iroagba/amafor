// src/lib/observability/metrics.ts
import { defaultObservabilityConfig } from './config';
import type { PerformanceMetric, BusinessMetric } from './types';

// Type guards for Performance API
function isLayoutShift(entry: PerformanceEntry): entry is LayoutShift {
  return entry.entryType === 'layout-shift';
}

function isLargestContentfulPaint(entry: PerformanceEntry): entry is LargestContentfulPaint {
  return entry.entryType === 'largest-contentful-paint';
}

function isFirstInput(entry: PerformanceEntry): entry is FirstInput {
  return entry.entryType === 'first-input';
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  private performanceMetrics: PerformanceMetric[] = [];
  private businessMetrics: BusinessMetric[] = [];
  private countryStats = new Map<string, number>();
  private config = defaultObservabilityConfig.metrics;
  
  constructor(config = defaultObservabilityConfig.metrics) {
    this.config = config;
    this.setupPerformanceObservers();
  }
  
  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }
  
  // Performance Monitoring
  private setupPerformanceObservers(): void {
    if (!this.config.performance.length || typeof window === 'undefined') {
      return;
    }
    
    if ('PerformanceObserver' in window) {
      // LCP - Largest Contentful Paint
      if (this.config.performance.includes('LCP')) {
        try {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (lastEntry && isLargestContentfulPaint(lastEntry)) {
              this.recordPerformanceMetric('LCP', lastEntry.renderTime);
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (error) {
          console.warn('LCP monitoring failed:', error);
        }
      }
      
      // CLS - Cumulative Layout Shift
      if (this.config.performance.includes('CLS')) {
        try {
          new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
              if (isLayoutShift(entry) && !entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            
            if (clsValue > 0) {
              this.recordPerformanceMetric('CLS', clsValue);
            }
          }).observe({ type: 'layout-shift', buffered: true });
        } catch (error) {
          console.warn('CLS monitoring failed:', error);
        }
      }
      
      // FID - First Input Delay
      if (this.config.performance.includes('FID')) {
        try {
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (isFirstInput(entry)) {
                const fid = entry.processingStart - entry.startTime;
                this.recordPerformanceMetric('FID', fid);
              }
            }
          }).observe({ type: 'first-input', buffered: true });
        } catch (error) {
          console.warn('FID monitoring failed:', error);
        }
      }
      
      // INP - Interaction to Next Paint (Experimental)
      if (this.config.performance.includes('INP')) {
        try {
          // Track interactions manually since INP is newer
          this.setupInteractionTracking();
        } catch (error) {
          console.warn('INP monitoring failed:', error);
        }
      }
    }
  }
  
  // Manual interaction tracking for INP
  private setupInteractionTracking(): void {
    if (typeof window === 'undefined') return;
    
    const interactionEntries: Array<{
      startTime: number;
      duration: number;
      target: string;
    }> = [];
    
    const handleInteraction = (event: Event) => {
      const startTime = performance.now();
      
      const reportInteraction = () => {
        const duration = performance.now() - startTime;
        
        // Only track meaningful interactions
        if (duration > 0 && duration < 10000) {
          interactionEntries.push({
            startTime,
            duration,
            target: (event.target as Element)?.tagName || 'unknown'
          });
          
          // Keep only last 50 interactions
          if (interactionEntries.length > 50) {
            interactionEntries.shift();
          }
          
          // Calculate worst interaction in last 5 seconds
          this.calculateWorstINP(interactionEntries);
        }
      };
      
      // Use requestAnimationFrame to capture paint timing
      requestAnimationFrame(() => {
        requestAnimationFrame(reportInteraction);
      });
    };
    
    // Listen for key interactions
    const eventTypes = ['click', 'keydown', 'touchstart', 'pointerdown'];
    eventTypes.forEach(type => {
      window.addEventListener(type, handleInteraction, { 
        capture: true, 
        passive: true 
      });
    });
  }
  
  private calculateWorstINP(entries: Array<{ duration: number; startTime: number }>): void {
    const fiveSecondsAgo = performance.now() - 5000;
    const recentEntries = entries.filter(entry => entry.startTime > fiveSecondsAgo);
    
    if (recentEntries.length > 0) {
      const worstEntry = recentEntries.reduce((worst, current) => 
        current.duration > worst.duration ? current : worst
      );
      
      this.recordPerformanceMetric('INP', worstEntry.duration);
    }
  }
  
  // Fallback performance metrics for browsers without PerformanceObserver
  private setupFallbackPerformanceMetrics(): void {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('load', () => {
      const timing = performance.timing;
      
      if (timing) {
        // Time to First Byte
        const ttfb = timing.responseStart - timing.navigationStart;
        this.recordPerformanceMetric('TTFB', ttfb);
        
        // DOM Content Loaded
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        this.recordPerformanceMetric('DOM_READY', domReady);
        
        // Full Page Load
        const pageLoad = timing.loadEventEnd - timing.navigationStart;
        this.recordPerformanceMetric('PAGE_LOAD', pageLoad);
      }
      
      // Memory usage (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize) {
          this.recordPerformanceMetric('MEMORY_USED', memory.usedJSHeapSize);
        }
      }
    });
  }
  
  recordPerformanceMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      timestamp: new Date().toISOString()
    };
    
    this.performanceMetrics.push(metric);
    
    // Keep only last 100 performance metrics
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }
    
    // Log significant performance issues
    if (name === 'LCP' && value > 4000) {
      console.warn(`Poor ${name}: ${value}ms`);
    } else if (name === 'CLS' && value > 0.25) {
      console.warn(`Poor ${name}: ${value}`);
    } else if (name === 'FID' && value > 300) {
      console.warn(`Poor ${name}: ${value}ms`);
    }
  }
  
  // Business Metrics
  recordAdView(adId: string, zone: string, isUnique: boolean): void {
    if (!this.config.business.includes('ad_views')) return;
    
    const metric: BusinessMetric = {
      type: 'ad_view',
      value: isUnique ? 1 : 0,
      data: { 
        adId, 
        zone, 
        isUnique, 
        page: window.location.pathname,
        timestamp: Date.now() 
      },
      timestamp: new Date().toISOString()
    };
    
    this.businessMetrics.push(metric);
    
    // GA4 integration
    if (typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'ad_view', {
          ad_id: adId,
          ad_zone: zone,
          is_unique: isUnique,
          page_location: window.location.pathname
        });
      } catch (error) {
        console.warn('GA4 ad tracking failed:', error);
      }
    }
  }
  
  recordDonation(amount: number, transactionId: string, isRecurring = false): void {
    if (!this.config.business.includes('donations')) return;
    
    const metric: BusinessMetric = {
      type: 'donation',
      value: amount,
      data: { 
        transactionId, 
        isRecurring, 
        currency: 'NGN',
        timestamp: Date.now() 
      },
      timestamp: new Date().toISOString()
    };
    
    this.businessMetrics.push(metric);
    
    // Send to backend for receipt generation
    this.sendToBackend('/api/metrics/donation', metric);
  }
  
  recordRegistration(type: 'scout' | 'advertiser' | 'patron' | 'fan'): void {
    if (!this.config.business.includes('registrations')) return;
    
    const metric: BusinessMetric = {
      type: 'registration',
      value: 1,
      data: { 
        registrationType: type,
        timestamp: Date.now() 
      },
      timestamp: new Date().toISOString()
    };
    
    this.businessMetrics.push(metric);
  }
  
  // Country Tracking
  recordCountryVisit(country: string): void {
    if (!this.config.countries.active_users || !country) return;
    
    const current = this.countryStats.get(country) || 0;
    this.countryStats.set(country, current + 1);
  }
  
  // Error Tracking
  recordError(type: 'js_errors' | 'api_errors' | 'validation_errors', count = 1): void {
    if (!this.config.errors.includes(type)) return;
    
    const metric: BusinessMetric = {
      type: 'conversion',
      value: count,
      data: { 
        errorType: type,
        timestamp: Date.now() 
      },
      timestamp: new Date().toISOString()
    };
    
    this.businessMetrics.push(metric);
  }
  
  // Network Performance
  recordNetworkRequest(
    url: string, 
    duration: number, 
    status: number,
    method: string
  ): void {
    const metric: BusinessMetric = {
      type: 'conversion',
      value: duration,
      data: { 
        url, 
        status, 
        method,
        timestamp: Date.now() 
      },
      timestamp: new Date().toISOString()
    };
    
    this.businessMetrics.push(metric);
  }
  
  // Backend Sync
  private async sendToBackend(endpoint: string, data: any): Promise<void> {
    if (process.env.NODE_ENV !== 'production') return;
    
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        // Don't block the main thread
        keepalive: true
      });
    } catch (error) {
      // Silent fail for metrics
    }
  }
  
  // Public API
  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }
  
  getBusinessMetrics(type?: BusinessMetric['type']): BusinessMetric[] {
    if (type) {
      return this.businessMetrics.filter(m => m.type === type);
    }
    return [...this.businessMetrics];
  }
  
  getCountryStats(): Array<{ country: string; count: number }> {
    return Array.from(this.countryStats.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  getPerformanceSummary(): {
    lcp: number | null;
    cls: number | null;
    fid: number | null;
    inp: number | null;
  } {
    const lcp = this.getLatestMetricValue('LCP');
    const cls = this.getLatestMetricValue('CLS');
    const fid = this.getLatestMetricValue('FID');
    const inp = this.getLatestMetricValue('INP');
    
    return { lcp, cls, fid, inp };
  }
  
  private getLatestMetricValue(name: string): number | null {
    const metrics = this.performanceMetrics
      .filter(m => m.name === name)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return metrics.length > 0 ? metrics[0].value : null;
  }
  
  clearMetrics(): void {
    this.performanceMetrics = [];
    this.businessMetrics = [];
    this.countryStats.clear();
  }
  
  setConfig(config: typeof defaultObservabilityConfig.metrics): void {
    this.config = config;
  }
}

export const metrics = MetricsCollector.getInstance();