# Incident Response

> **Last Updated:** 2026-03-09

## Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| SEV-1 | Service outage | < 15 min | API completely down |
| SEV-2 | Degraded service | < 1 hour | Slow response times |
| SEV-3 | Minor issue | < 4 hours | Non-critical feature broken |
| SEV-4 | Cosmetic / low impact | Next sprint | UI alignment issue |

## Incident Process

1. **Detect** — Via monitoring alert or user report
2. **Triage** — Assign severity, notify stakeholders
3. **Mitigate** — Apply immediate fix or rollback
4. **Resolve** — Deploy permanent fix
5. **Post-mortem** — Document root cause and prevention
