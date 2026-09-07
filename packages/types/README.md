# Types Package (`packages/types/`)

## 1. Purpose of the Directory
`packages/types/` represents the single source of truth for cross-boundary TypeScript type definitions, request/response payload interfaces, real-time WebSocket event signatures, and domain entity models.

## 2. What Belongs Here
* Domain model interfaces (e.g., `Classroom`, `Assignment`, `Submission`, `Channel`, `Message`, `User`).
* API request and response data transfer contracts (DTOs).
* WebSocket event payloads and presence status enums.
* Role-Based Access Control (RBAC) permission definitions.

## 3. What Does NOT Belong Here
* Runtime business logic or executable functions (belongs in `packages/utilities/`).
* Database entity classes or ORM decorators (belongs in `backend/api/`).
* Implementation code prior to approved scaffolding phase.

## 4. Relationship to Other Directories
* Consumed by `apps/web/` and `apps/mobile/` for end-to-end type safety.
* Directly mirrors API contracts documented in `docs/05-api/` and database structures in `docs/04-database/`.
