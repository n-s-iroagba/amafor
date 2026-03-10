# Developer Experience (DX) Specifications

> **Last Updated:** 2026-03-09

## Local Development Setup

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 18.x | Runtime |
| npm | ≥ 9.x | Package manager |
| PostgreSQL | ≥ 14 | Database |

### Quick Start

```bash
git clone <repo-url>
cd amafor
npm install
cp client/.env.example client/.env.local
# Edit .env.local with your values
npm run dev  # starts both client and server
```

## IDE Configuration

- Recommended: VS Code
- Extensions: ESLint, Prettier, TypeScript, Mermaid Preview
- Settings: `.vscode/settings.json` (committed)

## Code Review Standards

- All PRs require at least 1 approval
- Lint checks must pass before merge
- Commit messages follow Conventional Commits
