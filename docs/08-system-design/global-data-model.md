# Data Model

> **Last Updated:** 2026-03-09

## Purpose

Entity-Relationship diagram and schema definitions for the application database.

## ERD

```mermaid
erDiagram
    USER ||--o| ADVERTISER : "has profile"
    USER ||--o{ AUDIT_LOG : "generates"
    USER {
        uuid id PK
        string email UK
        string passwordHash
        json roles
        enum status
        boolean emailVerified
    }
    ADVERTISER {
        uuid id PK
        uuid userId FK
        string companyName
        string contactPerson
    }
    AUDIT_LOG {
        uuid id PK
        uuid userId FK
        enum action
        timestamp createdAt
    }
```

## Schema Notes

- `roles` is stored as a JSON array (supports multi-role)
- All primary keys are UUIDs
- Soft deletes via `deletedAt` timestamp (paranoid mode)
