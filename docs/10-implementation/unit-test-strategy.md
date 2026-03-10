# Unit Test Strategy

> **Last Updated:** 2026-03-09

## Coverage Targets

| Layer | Target | Tool |
|-------|--------|------|
| Server services | ≥ 80% | Jest |
| Server controllers | ≥ 70% | Jest |
| Client components | ≥ 60% | Jest + React Testing Library |
| Client hooks | ≥ 80% | Jest |

## File Naming

- Test files: `{module}.test.ts` or `{module}.spec.ts`
- Test location: Co-located with source (in `__tests__/`) or in `tests/`

## Test Structure

```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should do X when Y', async () => {
      // Arrange → Act → Assert
    });
  });
});
```
