# Error Handling Strategy

> **Last Updated:** 2026-03-09

## Error Taxonomy

| Error Class | HTTP Code | Use Case |
|-------------|-----------|----------|
| `BadRequestError` | 400 | Validation failures, malformed input |
| `AppError (401)` | 401 | Invalid credentials, expired tokens |
| `AppError (403)` | 403 | Insufficient permissions (RBAC) |
| `NotFoundError` | 404 | Resource not found |
| `AppError (500)` | 500 | Unexpected server errors |

## Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

## Client-Side Handling

- API errors are caught by the `useApiQuery` hook
- Global error boundary catches render-time failures
- Toast notifications for user-facing errors
