# Data Requirements

> **Standard:** ISO/IEC/IEEE 29148:2018 §6.6.4  
> **Last Updated:** 2026-03-09

## Purpose

Specifies data storage, retention, integrity, privacy, and schema requirements.

## Data Entities

| Entity | Description | Retention | PII | Encryption |
|--------|-------------|-----------|-----|-----------|
| User | Platform user accounts | Indefinite (soft-delete) | Yes | At rest |
| Payment | Financial transactions | 7 years | Yes | At rest + in transit |

## Data Integrity Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| DR-001 | Email addresses must be unique per user | DB unique constraint |
| DR-002 | Passwords must be hashed (never stored in plaintext) | Application layer (bcrypt) |

## Backup & Recovery

| Requirement | Target |
|-------------|--------|
| Backup frequency | Daily |
| Recovery Point Objective (RPO) | < 24 hours |
| Recovery Time Objective (RTO) | < 4 hours |
