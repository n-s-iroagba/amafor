# {Service Name}

**Owner:** @team-or-person  
**Language / Runtime:** e.g. Node.js 20, Go 1.22  
**Status:** Active | Deprecated | Planned  
**Last Updated:** YYYY-MM-DD

## Responsibility

One paragraph: what this service does and what it does NOT do.

## Key Design Decisions

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-001](adrs/ADR-001-template.md) | *Decision title* | Accepted |

## Artifacts

| File | Description |
|------|-------------|
| `component-architecture.md` | Internal components and their boundaries |
| `data-model.md` | Local schema and migrations |
| `api-contract.yaml` | OpenAPI spec for exposed endpoints |
| `sequence-diagrams/` | Service-internal interaction flows |
| `state-models/` | Entity lifecycle state machines |
| `error-handling.md` | Service-specific error codes and recovery |
| `instrumentation-design.md` | Traces, metrics, logs emitted |
| `hook-hierarchy.md` | React hook tree (frontend only) |

## Related Services

- Calls: `<service-name>`
- Called by: `<service-name>`

## Upstream Docs

- System architecture: [`../../04-architecture/service-architecture.md`](../../04-architecture/service-architecture.md)
- Interface contract: [`../../07-interface-specification/api-contracts/`](../../07-interface-specification/api-contracts/)
