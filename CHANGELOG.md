# Changelog

All notable changes to the **HSE Safety Intelligence Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-10

### Added
- **HSE Command Center Dashboard**: Real-time KPI metrics, SIF precursor rates, risk distributions, hazard frequencies, IOGP Life-Saving Rules breakdown, and site analytics.
- **AI Safety Intelligence Engine**: Automated NLP evaluation of safety event narratives into SIF classifications, critical controls, barrier failures, and consequence assessments.
- **Safety Report Lifecycle**: End-to-end report submission, multi-tier filtering, audit registers, timeline tracking, and full lifecycle inspection.
- **Centralized API Client**: Robust fetch abstraction with timeout handling, parameter serialization, and standardized error normalization.
- **Enterprise UX Design System**: Dark-mode glassmorphic interface with responsive layouts, skeleton loaders, empty states, and error recovery buttons.
- **Documentation & Compliance**: Comprehensive setup guide, architecture specifications, API documentation, and security protocols.

### Fixed
- Fixed backend database type mappings using `Prisma.InputJsonValue` for raw AI payloads and metadata.
- Aligned `ReportType` enumeration across frontend form, backend validation schemas, and database definitions (`UNSAFE_ACT`, `UNSAFE_CONDITION`, `NEAR_MISS`, `INCIDENT`).
- Added UUID validation guards preventing mock ID collisions against backend REST endpoints.
- Resolved division-by-zero edge cases in SVG trend timeline coordinate calculations.

### Changed
- Standardized frontend and backend ports to `http://localhost:5173` and `http://localhost:3000`.
- Enabled concurrent data loading across 8+ independent dashboard API endpoints using `Promise.all`.
