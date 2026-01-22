import { Span } from '@opentelemetry/api';
export declare const tracer: {
    startActiveSpan<T>(name: string, fn: (span: Span) => Promise<T>, kind?: any, attributes?: Record<string, any> | undefined): Promise<T>;
    startSpan(name: string, options?: any, context?: any): Span;
};
export default tracer;
//# sourceMappingURL=tracer.d.ts.map