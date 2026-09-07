# System Testing Suites (`tests/`)

## 1. Purpose of the Directory
The `tests/` directory organizes cross-cutting, system-level, end-to-end, and non-functional testing suites for the Classroom Platform.

While individual applications and services maintain localized unit tests within their respective directories (e.g., `apps/web/tests/`, `backend/api/src/test/`), this top-level directory houses comprehensive integration verification, security scans, performance benchmarks, and end-to-end tests that span multiple tiers.

## 2. Directory Structure

```text
tests/
├── README.md             # Testing strategy and harness blueprint
├── unit/                 # Monorepo-wide unit test coordination guidelines
├── integration/          # Multi-service integration test harnesses (API + DB + Redis)
├── api/                  # REST API contract testing and schema validation (e.g., Newman/RestAssured)
├── e2e/                  # End-to-end browser and mobile journey tests (e.g., Playwright/Maestro)
├── security/             # Automated vulnerability, DAST, and dependency security checks
├── performance/          # Load, stress, and endurance test scenarios (e.g., k6/Gatling)
├── realtime/             # High-concurrency WebSocket messaging & presence stress tests
└── live-class/           # WebRTC media simulation, room capacity, and SFU load tests
```

## 3. What Belongs Here
* Cross-service integration test definitions.
* Playwright/Cypress end-to-end test specifications.
* k6 load-testing scripts and WebRTC synthetic traffic generators.
* Security vulnerability regression test definitions.

## 4. What Does NOT Belong Here
* Isolated unit tests for single React components (belongs in `apps/web/tests/`).
* Isolated Spring Boot service unit tests (belongs in `backend/api/src/test/`).
* Test execution code prior to official testing framework scaffolding.

## 5. Relationship to Other Directories
* Validates requirements in `docs/01-requirements/acceptance-criteria.md`.
* Follows the quality guidelines specified in `docs/07-engineering/testing-strategy.md`.
