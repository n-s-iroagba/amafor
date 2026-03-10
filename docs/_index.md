# Documentation Artifact Registry

> **Project:** Amafor Gladiators FC Platform  
> **Standard:** ISO/IEC/IEEE 29148:2018 — Requirements Engineering  
> **Last Updated:** 2026-03-09

## Purpose

This file is the **single source of truth** for all documentation artifacts across the project lifecycle. Each artifact is tracked with its current status, owner, and link.

## Artifact Status Legend

| Status | Meaning |
|--------|---------|
| 🟢 Approved | Reviewed, signed off, baselined |
| 🟡 In Review | Drafted, awaiting stakeholder review |
| 🔵 Draft | Work-in-progress, not yet ready for review |
| ⚪ Template | Placeholder following ISO template — content not yet authored |
| 🔴 Deprecated | Superseded or no longer applicable |

---

## Phase 01 — Business Analysis

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Business Requirements Document (PDF) | [`BRD v1.0`](01-business-analysis/AMAFOR_GALADIATORSFC_BUSINESS_REQUIREMENTS_DOCUMENT_V1.0.pdf) | 🟢 Approved | Nnamdi Solomon Iroagba |
| Business Requirements Document (Template) | [`brd.md`](01-business-analysis/brd.md) | ⚪ Template | — |
| Product Requirements Document | [`prd.md`](01-business-analysis/prd.md) | 🔵 Draft | Nnamdi Solomon Iroagba |
| Stakeholder Identification | [`stakeholder-identification.md`](01-business-analysis/stakeholder-identification.md) | ⚪ Template | — |
| RACI Matrix | [`raci.md`](01-business-analysis/raci.md) | ⚪ Template | — |

## Phase 02 — Stakeholder Requirements

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Stakeholder Needs | [`stakeholder-needs.md`](02-stakeholder-requirements/stakeholder-needs.md) | ⚪ Template | — |
| Concept of Operations | [`concept-of-operations.md`](02-stakeholder-requirements/concept-of-operations.md) | ⚪ Template | — |
| Operational Scenarios | [`operational-scenarios.md`](02-stakeholder-requirements/operational-scenarios.md) | ⚪ Template | — |
| Business Constraints | [`business-constraints.md`](02-stakeholder-requirements/business-constraints.md) | ⚪ Template | — |
| User Stories | [`user-stories.md`](02-stakeholder-requirements/user-stories.md) | 🔵 Draft | Engineering Team |
| Use Cases (Route-Mapped) | [`UC-full-use-cases.md`](02-stakeholder-requirements/use-cases/UC-full-use-cases.md) | 🔵 Draft | Engineering Team |
| Use Cases (ISO-Refined) | [`UC-refined-use-cases.md`](02-stakeholder-requirements/use-cases/UC-refined-use-cases.md) | 🔵 Draft | Engineering Team |
| User Journeys (Complete) | [`IF-all-user-journeys.md`](02-stakeholder-requirements/interaction-flows/IF-all-user-journeys.md) | 🔵 Draft | Engineering Team |

## Phase 03 — System Requirements

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Software Requirements Specification | [`srs.md`](03-system-requirements/srs.md) | 🔵 Draft | Engineering Team |
| Functional Requirements | [`functional-requirements.md`](03-system-requirements/functional-requirements.md) | ⚪ Template | — |
| NFR Overview | [`nfr-overview.md`](03-system-requirements/non-functional-requirements/nfr-overview.md) | ⚪ Template | — |
| Interface Requirements | [`interface-requirements.md`](03-system-requirements/interface-requirements.md) | ⚪ Template | — |
| Data Requirements | [`data-requirements.md`](03-system-requirements/data-requirements.md) | ⚪ Template | — |
| Verification Requirements | [`verification-requirements.md`](03-system-requirements/verification-requirements.md) | ⚪ Template | — |

## Phase 04 — Architecture

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Service Architecture | [`service-architecture.md`](04-architecture/service-architecture.md) | ⚪ Template | — |
| System Context Diagram | [`system-context-diagram.md`](04-architecture/system-context-diagram.md) | ⚪ Template | — |
| High-Level Data Flow | [`high-level-data-flow.md`](04-architecture/high-level-data-flow.md) | ⚪ Template | — |
| Infrastructure Model | [`infrastructure-model.md`](04-architecture/infrastructure-model.md) | ⚪ Template | — |
| Observability Architecture | [`observability-architecture.md`](04-architecture/observability-architecture.md) | ⚪ Template | — |

## Phase 05 — Technical Governance

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| DX Specifications | [`dx-specs.md`](05-technical-governance/dx-specs.md) | ⚪ Template | — |
| CI/CD | [`ci-cd.md`](05-technical-governance/ci-cd.md) | ⚪ Template | — |
| Linting | [`linting.md`](05-technical-governance/linting.md) | ⚪ Template | — |
| Configuration Management | [`configuration-management.md`](05-technical-governance/configuration-management.md) | ⚪ Template | — |
| Versioning | [`versioning.md`](05-technical-governance/versioning.md) | ⚪ Template | — |

## Phase 06 — Verification Planning

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Acceptance Criteria | [`acceptance-criteria.md`](06-verification-planning/acceptance-criteria.md) | ⚪ Template | — |
| Test ID Registry | [`test-ids.md`](06-verification-planning/test-ids.md) | ⚪ Template | — |
| Requirements Traceability Matrix | [`rtm.md`](06-verification-planning/rtm.md) | ⚪ Template | — |

## Phase 07 — Interface Specification

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| OpenAPI Specification | [`openapi.yaml`](07-interface-specification/api-contracts/openapi.yaml) | 🔵 Draft | Engineering Team |

## Phase 08 — Detailed Design

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Screen Inventory (123 screens) | [`screen-inventory.md`](08-detailed-design/screen-inventory.md) | 🔵 Draft | Engineering Team |
| Screen Inventory (Client) | [`screens-inventory-client.md`](08-detailed-design/screens-inventory-client.md) | 🔵 Draft | Engineering Team |
| Hook Hierarchy | [`hook-hierarchy.md`](08-detailed-design/hook-hierarchy.md) | ⚪ Template | — |
| Data Model | [`data-model.md`](08-detailed-design/data-model.md) | ⚪ Template | — |
| Error Handling | [`error-handling.md`](08-detailed-design/error-handling.md) | ⚪ Template | — |
| Instrumentation Design | [`instrumentation-design.md`](08-detailed-design/instrumentation-design.md) | ⚪ Template | — |

## Phase 09 — Implementation

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Coding Standards | [`coding-standards.md`](09-implementation/coding-standards.md) | ⚪ Template | — |
| Unit Test Strategy | [`unit-test-strategy.md`](09-implementation/unit-test-strategy.md) | ⚪ Template | — |
| Build Artifacts | [`build-artifacts.md`](09-implementation/build-artifacts.md) | ⚪ Template | — |

## Phase 10 — Transition & Operations

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Monitoring | [`monitoring.md`](10-transition-and-operations/monitoring.md) | ⚪ Template | — |
| Alerting | [`alerting.md`](10-transition-and-operations/alerting.md) | ⚪ Template | — |
| Incident Response | [`incident-response.md`](10-transition-and-operations/incident-response.md) | ⚪ Template | — |
| Deployment Environments | [`deployment-environments.md`](10-transition-and-operations/deployment-environments.md) | ⚪ Template | — |

---

## Cross-Phase Artifacts

| Artifact | File | Status | Owner |
|----------|------|--------|-------|
| Glossary (Ubiquitous Language) | [`_glossary.md`](_glossary.md) | 🔵 Draft | Engineering Team |
| Decision Index (ADRs) | [`_decisions.md`](_decisions.md) | ⚪ Template | — |
| Naming Conventions | [`naming-conventions.md`](naming-conventions.md) | 🟢 Approved | — |
