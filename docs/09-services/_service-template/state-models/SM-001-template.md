# SM-001: Template

> **Entity:** —  
> **Status:** Template  
> **Date:** 2026-03-09

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Created
    Created --> Active : verify
    Active --> Suspended : suspend
    Suspended --> Active : reactivate
    Active --> [*] : delete
```

## Transition Rules

| From | Event | To | Guard | Action |
|------|-------|----|-------|--------|
| Created | verify | Active | Email verified | Send welcome email |
