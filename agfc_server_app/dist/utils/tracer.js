"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracer = void 0;
// Mock Span implementation for development
class SimpleSpan {
    constructor() {
        this.attributes = {};
        this.events = [];
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
    }
    setAttributes(attributes) {
        Object.assign(this.attributes, attributes);
    }
    addEvent(name, attributes) {
        this.events.push({ name, attributes });
    }
    setStatus(status) {
        this.attributes._status = status;
    }
    recordException(error) {
        this.attributes._exception = {
            message: error.message,
            stack: error.stack,
        };
    }
    end() {
        // Span ended - in production this would send to telemetry
    }
}
// Simple tracer that creates mock spans
exports.tracer = {
    async startActiveSpan(name, fn, kind, attributes) {
        const span = new SimpleSpan();
        if (attributes) {
            span.setAttributes(attributes);
        }
        try {
            return await fn(span);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            span.setStatus({
                code: 2,
                message: errorMessage,
            });
            if (error instanceof Error) {
                span.recordException(error);
            }
            throw error;
        }
        finally {
            span.end();
        }
    },
    startSpan(name, options, context) {
        return new SimpleSpan();
    },
};
exports.default = exports.tracer;
//# sourceMappingURL=tracer.js.map