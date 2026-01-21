// Simple tracer implementation without complex OpenTelemetry setup
import { Span } from '@opentelemetry/api';

// Mock Span implementation for development
class SimpleSpan {
  private attributes: Record<string, any> = {};
  private events: Array<{ name: string; attributes?: Record<string, any> }> = [];

  setAttribute(key: string, value: any): void {
    this.attributes[key] = value;
  }

  setAttributes(attributes: Record<string, any>): void {
    Object.assign(this.attributes, attributes);
  }

  addEvent(name: string, attributes?: Record<string, any>): void {
    this.events.push({ name, attributes });
  }

  setStatus(status: { code: number; message?: string }): void {
    this.attributes._status = status;
  }

  recordException(error: Error): void {
    this.attributes._exception = {
      message: error.message,
      stack: error.stack,
    };
  }

  end(): void {
    // Span ended - in production this would send to telemetry
  }
}

// Simple tracer that creates mock spans
export const tracer = {
  async startActiveSpan<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    kind?: any,
    attributes?: Record<string, any>
  ): Promise<T> {
    const span = new SimpleSpan() as unknown as Span;
    
    if (attributes) {
      (span as any).setAttributes(attributes);
    }

    try {
      return await fn(span);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      (span as any).setStatus({
        code: 2,
        message: errorMessage,
      });
      if (error instanceof Error) {
        (span as any).recordException(error);
      }
      throw error;
    } finally {
      (span as any).end();
    }
  },

  startSpan(name: string, options?: any, context?: any): Span {
    return new SimpleSpan() as unknown as Span;
  },
};

export default tracer;