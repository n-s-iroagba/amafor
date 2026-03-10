# Coding Standards

> **Last Updated:** 2026-03-09

## Language & Frameworks

| Layer | Language | Framework | Version |
|-------|----------|-----------|---------|
| Client | TypeScript | Next.js (React) | 14.x |
| Server | TypeScript | Express + Sequelize | 4.x |

## Style Rules

- Use `const` by default, `let` when reassignment is needed, never `var`
- Prefer named exports over default exports (except page components)
- Use explicit return types on public API methods
- Maximum file length: ~400 lines (split into sub-modules if larger)

## Naming Conventions

See [`../../docs/naming-conventions.md`](../naming-conventions.md) for the full naming convention reference.
