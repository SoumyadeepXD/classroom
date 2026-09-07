# Shared Utilities Package (`packages/utilities/`)

## 1. Purpose of the Directory
`packages/utilities/` provides shared, pure helper functions, string formatters, date/time calculation routines, academic grade score calculators, and input validation helpers.

## 2. What Belongs Here
* Pure JavaScript/TypeScript functions with zero side effects.
* Timezone-aware date and academic schedule formatters.
* Byte size converters and file extension validators.
* Common regex patterns and sanitization helpers.

## 3. What Does NOT Belong Here
* React-specific hooks or UI components (belongs in `packages/ui` or `apps/`).
* Heavy server-side libraries or native binary bindings.
* Implementation code prior to approved scaffolding phase.

## 4. Relationship to Other Directories
* Consumed by `apps/web/`, `apps/mobile/`, and test suites in `tests/`.
