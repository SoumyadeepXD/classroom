# Shared Configuration Package (`packages/config/`)

## 1. Purpose of the Directory
`packages/config/` is intended to house shared engineering configurations, including code style rules, linter definitions, compiler options, and build presets.

## 2. What Belongs Here
* Future shared ESLint presets and rules.
* Future shared Prettier formatting rules.
* Future shared TypeScript `tsconfig.base.json` templates.
* Future Tailwind CSS theme presets.

## 3. What Does NOT Belong Here
* Application runtime secrets, `.env` files, or production credentials.
* Backend Spring Boot application properties (belongs in `backend/api/src/main/resources/`).
* Implementation code prior to approved scaffolding phase.

## 4. Relationship to Other Directories
* Referenced by `apps/web/`, `apps/mobile/`, and other `packages/` to enforce unified engineering standards as defined in `docs/07-engineering/coding-standards.md`.
