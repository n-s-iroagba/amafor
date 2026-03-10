# Instrumentation Design

> **Last Updated:** 2026-03-09

## Purpose

Defines where and how telemetry data (logs, traces, metrics) is emitted.

## Instrumentation Points

| Layer | Instrument | What | Tool |
|-------|-----------|------|------|
| Middleware | Trace span | Every HTTP request | OpenTelemetry |
| Service | Structured log | Business events | structuredLogger |
| Repository | Trace span | Database queries | OpenTelemetry |
| Controller | Error log | Caught exceptions | console.error + logger |

## Naming Conventions

- Span names: `{layer}.{Class}.{method}` (e.g., `service.UserService.adminUpdateUser`)
- Log events: `UPPER_SNAKE_CASE` (e.g., `USER_ADMIN_UPDATE`)
