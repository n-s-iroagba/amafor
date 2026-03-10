# Build Artifacts

> **Last Updated:** 2026-03-09

## Naming Convention

| Artifact | Pattern | Example |
|----------|---------|---------|
| Client build | `client-{version}-{hash}.tar.gz` | `client-1.2.3-abc1234.tar.gz` |
| Server build | `server-{version}-{hash}.tar.gz` | `server-1.2.3-abc1234.tar.gz` |

## Retention Policy

| Environment | Retention |
|-------------|-----------|
| Development | 7 days |
| Staging | 30 days |
| Production | 90 days |
