# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ISO-aligned documentation structure (`docs/01-10`)
- Naming conventions reference (`docs/naming-conventions.md`)
- RBAC overhaul: multi-role support, admin-only guards, JWT full-role encoding

### Changed
- Invite API now accepts `roles[]` array instead of single `role` string
- Client admin pages updated for multi-role checkbox selection

### Fixed
- `/auth/invite` endpoint was missing admin authorization guard
- `GET /users/:id` was accessible by scouts and advertisers
- JWT tokens only encoded first role, silently dropping additional roles
- `getPendingAdvertisers` queried non-existent `role` column instead of JSON `roles`
