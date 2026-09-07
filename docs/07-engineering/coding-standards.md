# Coding Standards & Conventions

## 1. General Principles

1. **Clarity Over Cleverness**: Code must be readable, self-documenting, and maintainable by any engineer across the project.
2. **Strict Typing**: No untyped code. TypeScript must run with `strict: true` (no implicit `any`). Java must use strict compiler flags (`-Werror -Xlint:all`).
3. **Immutability by Default**: Prefer immutable data structures, readonly properties, and pure functions.

---

## 2. Backend Coding Standards (Java / Spring Boot)

* **Code Style**: Google Java Style Guide (enforced via Spotless / Checkstyle).
* **Package Architecture**: Domain-driven packaging (`com.classroom.platform.<domain>`). Never import internal implementation details across domains; communicate through service interfaces.
* **Naming Conventions**:
  * Classes: `PascalCase` (e.g., `AssignmentService`, `SubmissionRepository`).
  * Methods & Variables: `camelCase` (e.g., `calculateRubricTotal()`, `studentId`).
  * Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_PARTS`).
* **Dependency Injection**: Use constructor-based injection (`@RequiredArgsConstructor` or explicit constructors); never use field injection (`@Autowired` on private fields).
* **DTOs & Entities**: Never expose database entities directly to the REST API layer; always map via explicit Request/Response DTOs (e.g., using MapStruct).

---

## 3. Frontend Coding Standards (TypeScript / Next.js / React Native)

* **Code Style**: Standardized via ESLint and Prettier.
* **File Naming**:
  * React Components: `kebab-case.tsx` (e.g., `rubric-scorecard.tsx`, `channel-tree.tsx`).
  * Hooks: `use-<name>.ts` (e.g., `use-classroom-socket.ts`).
  * Types: `<name>.types.ts` (e.g., `assignment.types.ts`).
* **State Management**:
  * Server-driven data must use TanStack Query (`useQuery`, `useMutation`).
  * Client UI state must use Zustand stores. Never use monolithic Redux stores.
* **Component Architecture**: Keep components under 150 lines. Extract complex sub-views into dedicated sub-components within the feature module.
