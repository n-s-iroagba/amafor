// src/lib/observability/tracer.ts
import { defaultObservabilityConfig } from './config';
import type { TraceSpan } from './types';

export class Tracer {
  private static instance: Tracer;
  private spans = new Map<string, TraceSpan>();
  private currentTraceId?: string;
  private config = defaultObservabilityConfig.tracing;
  
  constructor(config = defaultObservabilityConfig.tracing) {
    this.config = config;
  }
  
  static getInstance(): Tracer {
    if (!Tracer.instance) {
      Tracer.instance = new Tracer();
    }
    return Tracer.instance;
  }
  
  // Span Management
  startSpan(name: string, parentId?: string): string {
    if (!this.shouldSample()) return '';
    
    const spanId = this.generateSpanId();
    const span: TraceSpan = {
      id: spanId,
      name,
      startTime: performance.now(),
      parentId
    };
    
    this.spans.set(spanId, span);
    
    if (!parentId) {
      this.currentTraceId = spanId;
    }
    
    return spanId;
  }
  
  endSpan(spanId: string, tags?: Record<string, any>): void {
    if (!spanId) return;
    
    const span = this.spans.get(spanId);
    if (span) {
      span.endTime = performance.now();
      span.tags = tags;
      
      const duration = span.endTime - span.startTime;
      if (duration > 1000) {
        this.sendToBackend(span);
      }
    }
  }
  
  // API Tracing
  traceApiCall<T>(apiCall: Promise<T>, endpoint: string, method: string): Promise<T> {
    if (!this.config.spans.apiCalls) return apiCall;
    
    const spanId = this.startSpan(`${method} ${endpoint}`, this.currentTraceId);
    const startTime = Date.now();
    
    return apiCall
      .then(response => {
        this.endSpan(spanId, {
          endpoint,
          method,
          status: 'success',
          duration: Date.now() - startTime,
          statusCode: 200
        });
        return response;
      })
      .catch(error => {
        this.endSpan(spanId, {
          endpoint,
          method,
          status: 'error',
          error: error.message,
          duration: Date.now() - startTime,
          statusCode: error.response?.status
        });
        throw error;
      });
  }
  
  // User Interaction Tracing
  traceUserInteraction(action: string, element?: string): string {
    if (!this.config.spans.userInteractions) return '';
    
    return this.startSpan(`ui:${action}`, this.currentTraceId);
  }
  
  // Page Load Tracing
  tracePageLoad(page: string): string {
    if (!this.config.spans.pageLoad) return '';
    
    const spanId = this.startSpan(`page:${page}`);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.endSpan(spanId, {
            page,
            loadTime: performance.now(),
            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
          });
        }, 0);
      });
    }
    
    return spanId;
  }
  
  // Helper Methods
  private shouldSample(): boolean {
    return Math.random() < 0.1; // Sample 10% of traces
  }
  
  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
  
  private sendToBackend(span: TraceSpan): void {
    fetch('/api/traces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(span)
    }).catch(() => {
      // Fail silently
    });
  }
  
  // Public API
  getSpans(): TraceSpan[] {
    return Array.from(this.spans.values());
  }
  
  getCurrentTraceId(): string | undefined {
    return this.currentTraceId;
  }
  
  clearSpans(): void {
    this.spans.clear();
    this.currentTraceId = undefined;
  }
  
  setConfig(config: typeof defaultObservabilityConfig.tracing): void {
    this.config = config;
  }
}

export const tracer = Tracer.getInstance();