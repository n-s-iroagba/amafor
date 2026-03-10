# Alerting

> **Last Updated:** 2026-03-09

## Alert Rules

| Alert | Severity | Condition | Action |
|-------|----------|-----------|--------|
| API Down | Critical | Health check fails 3x | Page on-call |
| High Error Rate | Warning | > 5% 5xx in 5 min | Slack notification |
| DB Connection Pool | Warning | > 80% utilisation | Investigate |

## Escalation Path

1. Slack `#alerts` channel
2. On-call engineer (PagerDuty / manual)
3. Engineering lead
