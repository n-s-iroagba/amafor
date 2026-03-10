# Infrastructure Model

> **Last Updated:** 2026-03-09

## Deployment Topology

| Component | Platform | Region | Scaling |
|-----------|----------|--------|---------|
| Client | Vercel / Fly.io | — | Auto |
| Server | Fly.io | — | Horizontal |
| Database | — | — | Vertical |
| Email | PrivateEmail SMTP | — | N/A |

## Diagram

```mermaid
graph TB
    subgraph Internet
        CDN[CDN / Vercel Edge]
    end
    subgraph Cloud["Cloud Provider"]
        API[API Server]
        DB[(Database)]
    end
    subgraph External
        SMTP[SMTP]
        Payment[Paystack]
    end
    CDN --> API
    API --> DB
    API --> SMTP
    API --> Payment
```
