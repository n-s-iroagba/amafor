# 09 — Services

**Owner:** —  
**Status:** Template  
**Last Updated:** 2026-03-09

## Purpose

Per-service low-level design and architectural decisions. Each service gets its own directory containing all design artifacts scoped to that service.

## How to Add a New Service

```bash
cp -r docs/09-services/_service-template docs/09-services/<service-name>
```

Then fill in the README.md and relevant artifacts.

## Service Registry

| Service | Directory | Owner | Status |
|---------|-----------|-------|--------|
| *Template* | [`_service-template/`](_service-template/) | — | ⚪ Template |

> Add new services to this table as they are created.

## Template Structure

Each service directory contains:

```
<service-name>/
├── README.md                  # Service overview, ownership, responsibility
├── adrs/                      # Service-scoped architectural decisions
│   ├── README.md
│   └── ADR-001-<title>.md
├── component-architecture.md  # Component breakdown, responsibilities, boundaries
├── sequence-diagrams/         # Service-internal interaction flows
│   ├── README.md
│   └── SD-001-<flow-name>.md
├── state-models/              # Entity lifecycle state machines
│   └── SM-001-<entity>.md
├── data-model.md              # Service-local schema, migrations, ownership
├── api-contract.yaml          # Service-specific OpenAPI / AsyncAPI fragment
├── error-handling.md          # Service-specific error codes and recovery
├── instrumentation-design.md  # Traces, metrics, logs emitted by this service
├── hook-hierarchy.md          # Frontend services: React hook tree (omit if N/A)
└── assets/                    # Diagrams, screenshots
```

## Related Directories

- Upstream: [`../08-system-design/`](../08-system-design/) (cross-cutting design)
- Architecture: [`../04-architecture/`](../04-architecture/) (system architecture)
- Interfaces: [`../07-interface-specification/`](../07-interface-specification/) (API contracts)
