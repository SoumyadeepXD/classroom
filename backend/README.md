# Backend Services (`backend/`)

## 1. Purpose of the Directory
The `backend/` directory hosts the core server-side platform for Classroom Platform. It is responsible for business logic execution, data persistence, transaction management, real-time message routing, access control, and integration with third-party systems.

## 2. What Belongs Here
* `api/`: The primary backend application service (proposed: **Spring Boot**).
* Potential future asynchronous workers, queue consumers, or microservices.

## 3. What Does NOT Belong Here
* Frontend client code (belongs in `apps/web/` and `apps/mobile/`).
* Standalone infrastructure deployment manifests or Docker compose definitions (belongs in `infrastructure/`).
* Database migration runner scripts for standalone operations (belongs in `infrastructure/database/` or `scripts/database/`).

## 4. Relationship to Other Directories
* **`infrastructure/`**: Relies on infrastructure setups for PostgreSQL, Redis, MinIO, and LiveKit.
* **`packages/types/`**: Aligns with API contracts and data models shared across clients.
* **`docs/03-architecture/` & `docs/05-api/`**: Implements the technical architecture and endpoints documented in the system specifications.
