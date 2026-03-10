# 08 — System Design

**Owner:** —  
**Status:** Draft  
**Last Updated:** 2026-03-09

## Purpose

Houses **system-wide, cross-cutting** low-level design artifacts. These documents describe concerns that span multiple services or define canonical standards that individual services inherit.

> [!IMPORTANT]
> Service-specific design documents belong in [`../09-services/<service-name>/`](../09-services/README.md), **not** here.

## Artifacts

| File | Description | Status |
|------|-------------|--------|
| `global-data-model.md` | Canonical entity definitions, shared schemas | ⚪ Template |
| `global-error-handling.md` | Error taxonomy, propagation strategy, HTTP error codes | ⚪ Template |
| `global-instrumentation-design.md` | Cross-service observability: tracing propagation, metric naming | ⚪ Template |
| `screen-inventory.md` | 123-screen UI inventory (migrated from requirements) | 🔵 Draft |
| `screens-inventory-client.md` | Client-side screen inventory | 🔵 Draft |
| `cross-cutting-sequence-diagrams/` | Multi-service interaction flows | ⚪ Template |

## Scope Boundary

| Concern | Lives Here (08) | Lives in 09-services |
|---------|:-:|:-:|
| Service map & topology | — | — (04-architecture) |
| Canonical data model / shared entities | ✅ | — |
| Global error taxonomy | ✅ | — |
| Cross-service sequence diagrams | ✅ | — |
| Service-specific component arch | — | ✅ |
| Service-specific data model | — | ✅ |
| Service-specific sequence diagrams | — | ✅ |
| Service-specific state models | — | ✅ |
| Service API contract | — | ✅ |

## Related Directories

- Upstream: [`../04-architecture/`](../04-architecture/) (system architecture)
- Downstream: [`../09-services/`](../09-services/) (per-service design)
