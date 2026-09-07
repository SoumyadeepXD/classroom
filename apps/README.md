# Applications Directory (`apps/`)

## 1. Purpose of the Directory
The `apps/` directory contains all client-facing and end-user applications for the Classroom Platform monorepo. It houses distinct application frontends that consume shared packages, domain models, and the backend API.

## 2. What Belongs Here
* **`web/`**: Conceptual Next.js web application for desktop and mobile browser users.
* **`mobile/`**: Conceptual React Native / Expo application for iOS and Android devices.
* Future administrative dashboards or desktop client wrappers (e.g., Electron/Tauri).

## 3. What Does NOT Belong Here
* Backend server code, API services, or database engines (belongs in `backend/`).
* Cross-application shared types, utilities, or design tokens (belongs in `packages/`).
* Infrastructure deployment templates or Docker daemon configurations (belongs in `infrastructure/`).
* Application implementation code prior to the scaffolding phase.

## 4. Relationship to Other Directories
* **`packages/`**: Applications import UI components, shared type definitions, and common utilities from `packages/ui`, `packages/types`, and `packages/utilities`.
* **`backend/`**: Applications interact with the server through REST APIs, WebSocket real-time channels, and WebRTC streaming sessions provided by `backend/api/`.
* **`docs/`**: Feature layout mirrors domain specifications documented in `docs/01-requirements/` and `docs/05-api/`.
