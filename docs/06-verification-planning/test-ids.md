# Test ID Registry

> **Last Updated:** 2026-03-09

## Purpose

Master registry of all `data-testid` attributes used in the application for E2E and integration testing.

## Registry

| Test ID | Component | Page | Purpose |
|---------|-----------|------|---------|
| `btn-send-invite` | InviteUserPage | `/dashboard/admin/users/invite` | Submit invitation form |
| `input-user-email` | InviteUserPage | `/dashboard/admin/users/invite` | Email input field |
| `btn-delete-user` | UserDetailPage | `/dashboard/admin/users/[id]` | Delete user button |
| `btn-save-permissions` | UserDetailPage | `/dashboard/admin/users/[id]` | Save role changes |

> Add new test IDs in alphabetical order by component.
