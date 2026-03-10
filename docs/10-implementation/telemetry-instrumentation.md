# Telemetry Instrumentation Guide

> **Last Updated:** 2026-03-09

## How to Instrument New Code

### Service Layer

```typescript
public async myMethod(): Promise<Result> {
  return tracer.startActiveSpan('service.MyService.myMethod', async (span) => {
    try {
      // ... business logic ...
      structuredLogger.business('MY_EVENT', 0, userId, { key: 'value' });
      return result;
    } catch (error: any) {
      span.setStatus({ code: 2, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Naming

| Type | Format | Example |
|------|--------|---------|
| Span name | `{layer}.{Class}.{method}` | `service.UserService.createUser` |
| Log event | `UPPER_SNAKE_CASE` | `USER_CREATED` |
