# Versioning Strategy

> **Last Updated:** 2026-03-09

## Semantic Versioning

Format: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking API changes
- **MINOR:** New features, backwards-compatible
- **PATCH:** Bug fixes, backwards-compatible

## Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|-----------|
| `main` | Production-ready | Production |
| `develop` | Integration | Staging |
| `feature/*` | Feature work | — |
| `docs/*` | Documentation | — |
| `fix/*` | Bug fixes | — |

## Changelog

Maintained in [`CHANGELOG.md`](../../CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/).
