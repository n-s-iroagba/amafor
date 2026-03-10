# Hook Hierarchy

> **Last Updated:** 2026-03-09

## Purpose

Documents the React hook dependency tree to prevent circular dependencies and clarify data flow.

## Tree

```
useAuth
├── useApiQuery (GET /auth/me)
└── useLocalStorage (token)

useApiQuery
├── axios instance
└── useAuth (for token injection)

useAdServe
├── useApiQuery (GET /ads)
└── adZones config
```

## Rules

1. Hooks must not create circular dependencies
2. Data-fetching hooks must use the shared `useApiQuery` base
3. Auth state is always sourced from `useAuth`
