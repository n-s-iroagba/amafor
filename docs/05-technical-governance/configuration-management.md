# Configuration Management

> **Last Updated:** 2026-03-09

## Environment Variables Strategy

| Layer | File | Committed | Purpose |
|-------|------|-----------|---------|
| Client | `.env.local` | ❌ | Instance-specific secrets |
| Client | `.env.example` | ✅ | Documented template |
| Server | `.env` | ❌ | Instance-specific secrets |
| Server | `.env.example` | ✅ | Documented template |

## Secrets Management

- Never commit `.env` or `.env.local`
- Use platform-specific secret managers in production
- All `NEXT_PUBLIC_*` vars are exposed to the browser — never store secrets there
