import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor, ConsoleSpanExporter, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace, Context, Span, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { SequelizeInstrumentation } from '@opentelemetry/instrumentation-sequelize';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

// Initialize tracer provider
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'amafor-gladiators-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
});

// Configure exporter based on environment
let exporter;
if (process.env.OTEL_EXPORTER === 'jaeger') {
  exporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
  });
} else if (process.env.OTEL_EXPORTER === 'zipkin') {
  exporter = new ZipkinExporter({
    url: process.env.ZIPKIN_ENDPOINT || 'http://localhost:9411/api/v2/spans',
  });
} else if (process.env.OTEL_EXPORTER === 'otlp') {
  exporter = new OTLPTraceExporter({
    url: process.env.OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  });
} else {
  // Use console exporter for development
  exporter = new ConsoleSpanExporter();
}

// Add span processor
if (process.env.NODE_ENV === 'production') {
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
} else {
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
}

// Register instrumentations
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new SequelizeInstrumentation(),
  ],
});

// Register the provider
provider.register();

// Get tracer
export const tracer = trace.getTracer('amafor-gladiators-api');

// Helper functions for tracing
export const startSpan = (
  name: string,
  kind: SpanKind = SpanKind.INTERNAL,
  context?: Context,
  attributes?: Record<string, any>
): Span => {
  return tracer.startSpan(name, { kind }, context);
};

export const startActiveSpan = <T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  kind: SpanKind = SpanKind.INTERNAL,
  attributes?: Record<string, any>
): Promise<T> => {
  return tracer.startActiveSpan(name, { kind }, async (span) => {
    try {
      if (attributes) {
        span.setAttributes(attributes);
      }
      return await fn(span);
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
};

export const addSpanAttributes = (span: Span, attributes: Record<string, any>) => {
  span.setAttributes(attributes);
};

export const recordSpanEvent = (span: Span, name: string, attributes?: Record<string, any>) => {
  span.addEvent(name, attributes);
};

// Database query tracing
export const traceDatabaseQuery = async <T>(
  operation: string,
  query: string,
  parameters?: any[],
  fn: () => Promise<T>
): Promise<T> => {
  return startActiveSpan(`db.${operation}`, async (span) => {
    span.setAttributes({
      'db.operation': operation,
      'db.statement': query,
      'db.parameters': JSON.stringify(parameters || []),
    });
    
    const startTime = Date.now();
    try {
      const result = await fn();
      span.setAttributes({
        'db.duration_ms': Date.now() - startTime,
      });
      return result;
    } catch (error) {
      span.setAttributes({
        'db.error': error.message,
        'db.duration_ms': Date.now() - startTime,
      });
      throw error;
    }
  });
};

// HTTP request tracing
export const traceHttpRequest = async <T>(
  method: string,
  url: string,
  fn: () => Promise<T>
): Promise<T> => {
  return startActiveSpan(`http.${method}`, async (span) => {
    span.setAttributes({
      'http.method': method,
      'http.url': url,
      'http.start_time': Date.now(),
    });
    
    try {
      const response = await fn();
      span.setAttributes({
        'http.status_code': 200,
        'http.duration_ms': Date.now() - Number(span.attributes['http.start_time']),
      });
      return response;
    } catch (error) {
      span.setAttributes({
        'http.status_code': error.status || 500,
        'http.error': error.message,
        'http.duration_ms': Date.now() - Number(span.attributes['http.start_time']),
      });
      throw error;
    }
  });
};

// Business operation tracing
export const traceBusinessOperation = async <T>(
  domain: string,
  operation: string,
  entityId?: string,
  attributes?: Record<string, any>,
  fn: () => Promise<T>
): Promise<T> => {
  return startActiveSpan(`${domain}.${operation}`, async (span) => {
    span.setAttributes({
      'business.domain': domain,
      'business.operation': operation,
      'business.entity_id': entityId,
      'business.start_time': Date.now(),
      ...attributes,
    });
    
    try {
      const result = await fn();
      span.setAttributes({
        'business.duration_ms': Date.now() - Number(span.attributes['business.start_time']),
        'business.success': true,
      });
      return result;
    } catch (error) {
      span.setAttributes({
        'business.duration_ms': Date.now() - Number(span.attributes['business.start_time']),
        'business.success': false,
        'business.error': error.message,
      });
      throw error;
    }
  });
};

// Extract trace context from request
export const extractTraceContext = (req: any): Context => {
  const carrier = {
    'traceparent': req.headers['traceparent'],
    'tracestate': req.headers['tracestate'],
  };
  return trace.getSpanContext(carrier);
};

// Create a child span
export const createChildSpan = (parentSpan: Span, name: string, attributes?: Record<string, any>): Span => {
  const ctx = trace.setSpan(trace.contextActive(), parentSpan);
  const span = tracer.startSpan(name, undefined, ctx);
  
  if (attributes) {
    span.setAttributes(attributes);
  }
  
  return span;
};

// Default export
export default tracer;