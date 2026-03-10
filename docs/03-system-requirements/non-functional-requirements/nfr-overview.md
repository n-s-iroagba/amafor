# Non-Functional Requirements — Overview

> **Standard:** ISO/IEC/IEEE 29148:2018 §6.6.2  
> **Last Updated:** 2026-03-09

## Categories

| Category | ID Range | Target |
|----------|----------|--------|
| Performance | NFR-PERF-### | Page load < 2s (P95) |
| Availability | NFR-AVAIL-### | 99.9% uptime |
| Security | NFR-SEC-### | OWASP Top 10 compliance |
| Scalability | NFR-SCALE-### | Support 10K concurrent users |
| Accessibility | NFR-ACC-### | WCAG 2.1 AA |
| Maintainability | NFR-MAINT-### | Test coverage > 80% |
| Observability | NFR-OBS-### | See `observability-requirements.md` |

## Requirements

| ID | Requirement | Category | Verification Method |
|----|-------------|----------|---------------------|
| NFR-PERF-001 | | Performance | Load test |
