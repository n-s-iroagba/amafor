# CI/CD Pipeline

> **Last Updated:** 2026-03-09

## Pipeline Stages

| Stage | Trigger | Actions | Required to Merge |
|-------|---------|---------|-------------------|
| Lint | On PR | ESLint, Prettier | ✅ |
| Type Check | On PR | tsc --noEmit | ✅ |
| Unit Tests | On PR | Jest / Vitest | ✅ |
| Build | On PR | next build, tsc | ✅ |
| Deploy (Staging) | On merge to `develop` | Auto-deploy | — |
| Deploy (Production) | On merge to `main` | Manual approval | — |

## Workflow Files

<!-- Location: .github/workflows/ -->
