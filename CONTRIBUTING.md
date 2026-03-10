# Contributing to Amafor Gladiators FC Platform

Thank you for contributing! This document explains how to get started.

## Getting Started

1. Fork and clone the repo
2. Install dependencies: `npm install` (from root)
3. Copy env files: `cp client/.env.example client/.env.local`
4. Start dev servers: `npm run dev`

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/{short-description}` | `feature/add-player-search` |
| Bug fix | `fix/{short-description}` | `fix/login-redirect` |
| Documentation | `docs/{phase}/{artifact}` | `docs/01-business-analysis/brd` |
| Chore | `chore/{short-description}` | `chore/update-deps` |

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): fix a bug
docs(scope): update documentation
chore(scope): maintenance task
```

## Pull Requests

- All PRs require at least 1 review
- CI checks must pass (lint, type check, build)
- Write a clear PR description explaining **what** and **why**

## Code Standards

See [`docs/09-implementation/coding-standards.md`](docs/09-implementation/coding-standards.md).

## Documentation

See [`docs/naming-conventions.md`](docs/naming-conventions.md) for documentation naming rules.
