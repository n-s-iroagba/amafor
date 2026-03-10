# IF-001 — Template

> **Status:** Template  
> **Date:** 2026-03-09

## Flow Description

<!-- Brief description of the user interaction this flow covers. -->

## Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Backend API
    participant DB as Database

    User->>UI: Action
    UI->>API: Request
    API->>DB: Query
    DB-->>API: Result
    API-->>UI: Response
    UI-->>User: Feedback
```

## Notes

<!-- Design decisions, edge cases, error states. -->

## Traceability

| Type | ID |
|------|----|
| Use Case | UC-### |
| Screen | SC-### |
